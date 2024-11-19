import fs from 'fs'
import gulp from 'gulp'
import { deleteSync as del, deleteAsync } from 'del'
import eventStream from 'event-stream'
import jshint from 'gulp-jshint'
import gzip from 'gulp-gzip'
import istanbul from 'gulp-istanbul'
import webserver from 'gulp-webserver'
import jsdoc from 'gulp-jsdoc3'
import bower from 'gulp-bower'
import ghPages from 'gulp-gh-pages-will'
import bump from 'gulp-bump'
import minimist from 'minimist'
import git from 'gulp-git'
import * as esbuild from 'esbuild'
import { $ } from 'zx'

$.verbose = true

const { merge } = eventStream

const argv = minimist(process.argv.slice(2))

gulp.task('clean', async () => {
	await deleteAsync(['.publish/', 'coverage/', 'build/', 'publish/'])
})

gulp.task(
	'build',
	gulp.series('clean', async () => {
		await esbuild.build({
			entryPoints: ['src/kuromoji.js'],
			bundle: true,
			outfile: 'build/kuromoji.js',
			platform: 'node',
			target: 'esnext',
		})
	}),
)

gulp.task('watch', () => {
	gulp.watch(
		['src/**/*.js', 'test/**/*.js'],
		gulp.series('lint', 'build', 'jsdoc'),
	)
})

gulp.task('clean-dict', async () => {
	await deleteAsync(['dict/'])
})

gulp.task(
	'create-dat-files',
	gulp.series('build', 'clean-dict', async () => {
		const IPADic = require('mecab-ipadic-seed')
		const kuromoji = require('./src/kuromoji.js')

		if (!fs.existsSync('dict/')) {
			fs.mkdirSync('dict/')
		}

		// To node.js Buffer
		function toBuffer(typed) {
			var ab = typed.buffer
			var buffer = new Buffer(ab.byteLength)
			var view = new Uint8Array(ab)
			for (var i = 0; i < buffer.length; ++i) {
				buffer[i] = view[i]
			}
			return buffer
		}

		const dic = new IPADic()
		const builder = kuromoji.dictionaryBuilder()

		// Build token info dictionary
		const tokenInfoPromise = dic
			.readTokenInfo((line) => {
				builder.addTokenInfoDictionary(line)
			})
			.then(() => {
				console.log('Finishied to read token info dics')
			})

		// Build connection costs matrix
		const matrixDefPromise = dic
			.readMatrixDef((line) => {
				builder.putCostMatrixLine(line)
			})
			.then(() => {
				console.log('Finishied to read matrix.def')
			})

		// Build unknown dictionary
		const unkDefPromise = dic
			.readUnkDef((line) => {
				builder.putUnkDefLine(line)
			})
			.then(() => {
				console.log('Finishied to read unk.def')
			})

		// Build character definition dictionary
		const charDefPromise = dic
			.readCharDef((line) => {
				builder.putCharDefLine(line)
			})
			.then(() => {
				console.log('Finishied to read char.def')
			})

		// Build kuromoji.js binary dictionary
		await Promise.all([
			tokenInfoPromise,
			matrixDefPromise,
			unkDefPromise,
			charDefPromise,
		])

		console.log('Finishied to read all seed dictionary files')
		console.log('Building binary dictionary ...')
		await builder.build()

		const base_buffer = toBuffer(dic.trie.bc.getBaseBuffer())
		const check_buffer = toBuffer(dic.trie.bc.getCheckBuffer())
		const token_info_buffer = toBuffer(
			dic.token_info_dictionary.dictionary.buffer,
		)
		const tid_pos_buffer = toBuffer(dic.token_info_dictionary.pos_buffer.buffer)
		const tid_map_buffer = toBuffer(
			dic.token_info_dictionary.targetMapToBuffer(),
		)
		const connection_costs_buffer = toBuffer(dic.connection_costs.buffer)
		const unk_buffer = toBuffer(dic.unknown_dictionary.dictionary.buffer)
		const unk_pos_buffer = toBuffer(dic.unknown_dictionary.pos_buffer.buffer)
		const unk_map_buffer = toBuffer(dic.unknown_dictionary.targetMapToBuffer())
		const char_map_buffer = toBuffer(
			dic.unknown_dictionary.character_definition.character_category_map,
		)
		const char_compat_map_buffer = toBuffer(
			dic.unknown_dictionary.character_definition.compatible_category_map,
		)
		const invoke_definition_map_buffer = toBuffer(
			dic.unknown_dictionary.character_definition.invoke_definition_map.toBuffer(),
		)

		fs.writeFileSync('dict/base.dat', base_buffer)
		fs.writeFileSync('dict/check.dat', check_buffer)
		fs.writeFileSync('dict/tid.dat', token_info_buffer)
		fs.writeFileSync('dict/tid_pos.dat', tid_pos_buffer)
		fs.writeFileSync('dict/tid_map.dat', tid_map_buffer)
		fs.writeFileSync('dict/cc.dat', connection_costs_buffer)
		fs.writeFileSync('dict/unk.dat', unk_buffer)
		fs.writeFileSync('dict/unk_pos.dat', unk_pos_buffer)
		fs.writeFileSync('dict/unk_map.dat', unk_map_buffer)
		fs.writeFileSync('dict/unk_char.dat', char_map_buffer)
		fs.writeFileSync('dict/unk_compat.dat', char_compat_map_buffer)
		fs.writeFileSync('dict/unk_invoke.dat', invoke_definition_map_buffer)
	}),
)

gulp.task('compress-dict', () => {
	return gulp.src('dict/*.dat').pipe(gzip()).pipe(gulp.dest('dict/'))
})

gulp.task('clean-dat-files', async () => {
	await deleteAsync(['dict/*.dat'])
})

gulp.task(
	'build-dict',
	gulp.series(
		'build',
		'clean-dict',
		'create-dat-files',
		'compress-dict',
		'clean-dat-files',
	),
)

gulp.task(
	'test',
	gulp.series('build', async () => {
		await $`vitest run`
	}),
)

gulp.task(
	'coverage',
	gulp.series('build', async () => {
		await $`vitest run --coverage`
	}),
)

gulp.task('lint', () => {
	return gulp
		.src(['src/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
})

gulp.task('clean-jsdoc', async () => {
	await deleteAsync(['publish/jsdoc/'])
})

gulp.task(
	'jsdoc',
	gulp.series('clean-jsdoc', (cb) => {
		var config = require('./jsdoc.json')
		return gulp.src(['src/**/*.js'], { read: false }).pipe(jsdoc(config, cb))
	}),
)

gulp.task('clean-demo', async () => {
	await deleteAsync(['publish/demo/'])
})

gulp.task(
	'copy-demo',
	gulp.series('clean-demo', 'build', () => {
		return merge(
			gulp.src('demo/**/*').pipe(gulp.dest('publish/demo/')),
			gulp.src('build/**/*').pipe(gulp.dest('publish/demo/kuromoji/build/')),
			gulp.src('dict/**/*').pipe(gulp.dest('publish/demo/kuromoji/dict/')),
		)
	}),
)

gulp.task(
	'build-demo',
	gulp.series('copy-demo', () => {
		return bower({ cwd: 'publish/demo/' })
	}),
)

gulp.task(
	'webserver',
	gulp.series('build-demo', 'jsdoc', () => {
		return gulp.src('publish/').pipe(
			webserver({
				port: 8000,
				livereload: true,
				directoryListing: true,
			}),
		)
	}),
)

gulp.task(
	'deploy',
	gulp.series('build-demo', 'jsdoc', () => {
		return gulp.src('publish/**/*').pipe(ghPages())
	}),
)

gulp.task('version', function () {
	let type = 'patch'
	if (argv['minor']) {
		type = 'minor'
	}
	if (argv['major']) {
		type = 'major'
	}
	if (argv['prerelease']) {
		type = 'prerelease'
	}
	return gulp
		.src(['./bower.json', './package.json'])
		.pipe(bump({ type: type }))
		.pipe(gulp.dest('./'))
})

gulp.task('release-commit', function () {
	var version = JSON.parse(fs.readFileSync('./package.json', 'utf8')).version
	return gulp
		.src('.')
		.pipe(git.add())
		.pipe(git.commit(`chore: release ${version}`))
})

gulp.task('release-tag', function (done) {
	var version = JSON.parse(fs.readFileSync('./package.json', 'utf8')).version
	git.tag(version, `${version} release`, function (error) {
		if (error) {
			return done(error)
		}
		done()
	})
})

gulp.task('release', gulp.series('test', 'release-commit', 'release-tag'))
