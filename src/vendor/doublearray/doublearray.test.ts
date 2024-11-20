// Copyright (c) 2014 Takuya Asano All Rights Reserved.

import * as doublearray from './doublearray'

describe('doublearray', function () {
	describe('contain', function () {
		let trie // target
		const dict = {
			apple: 1,
			ball: 2,
			bear: 3,
			bird: 4,
			bison: 5,
			black: 6,
			blue: 7,
			blur: 8,
			cold: 10,
			column: 11,
			cow: 12,
		}
		const words = []
		for (const key in dict) {
			words.push({ k: key, v: dict[key] })
		}
		it('Contain bird', function () {
			trie = doublearray.builder().build(words)
			expect(trie.contain('bird')).to.be.true
		})
		it('Contain bison', function () {
			trie = doublearray.builder().build(words)
			expect(trie.contain('bison')).to.be.true
		})
		it('Lookup bird', function () {
			trie = doublearray.builder().build(words)
			expect(trie.lookup('bird')).to.be.eql(dict['bird'])
		})
		it('Lookup bison', function () {
			trie = doublearray.builder().build(words)
			expect(trie.lookup('bison')).to.be.eql(dict['bison'])
		})
		it('Build', function () {
			trie = doublearray.builder(4).build(words)
			// trie.bc.
			expect(trie.lookup('bison')).to.be.eql(dict['bison'])
		})
	})
	describe('load', function () {
		let trie // target
		let load_trie // target
		const words = [{ k: 'apple', v: 1 }] // test data
		beforeEach(function () {
			// Build original
			trie = doublearray.builder().build(words)

			// Load from original typed array
			const base_buffer = trie.bc.getBaseBuffer()
			const check_buffer = trie.bc.getCheckBuffer()
			load_trie = doublearray.load(base_buffer, check_buffer)
		})
		it('Original and loaded tries lookup successfully', function () {
			expect(trie.lookup('apple')).to.be.eql(words[0].v)
			expect(load_trie.lookup('apple')).to.be.eql(words[0].v)
		})
		it('Original and loaded typed arrays are same', function () {
			expect(trie.bc.getBaseBuffer()).to.deep.eql(load_trie.bc.getBaseBuffer())
			expect(trie.bc.getCheckBuffer()).to.deep.eql(
				load_trie.bc.getCheckBuffer(),
			)
		})
	})
})
