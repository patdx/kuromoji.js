class IpadicFormatter {
	formatEntry(word_id, position, type, features) {
		const token = {}
		token.word_id = word_id
		token.word_type = type
		token.word_position = position

		token.surface_form = features[0]
		token.pos = features[1]
		token.pos_detail_1 = features[2]
		token.pos_detail_2 = features[3]
		token.pos_detail_3 = features[4]
		token.conjugated_type = features[5]
		token.conjugated_form = features[6]
		token.basic_form = features[7]
		token.reading = features[8]
		token.pronunciation = features[9]

		return token
	}

	formatUnknownEntry(word_id, position, type, features, surface_form) {
		const token = {}
		token.word_id = word_id
		token.word_type = type
		token.word_position = position

		token.surface_form = surface_form
		token.pos = features[1]
		token.pos_detail_1 = features[2]
		token.pos_detail_2 = features[3]
		token.pos_detail_3 = features[4]
		token.conjugated_type = features[5]
		token.conjugated_form = features[6]
		token.basic_form = features[7]
		// token.reading = features[8];
		// token.pronunciation = features[9];

		return token
	}
}

export default IpadicFormatter
