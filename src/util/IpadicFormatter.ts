export interface IpadicFeatures {
	word_id: number
	word_type: string
	word_position: number
	surface_form: string
	pos: string
	pos_detail_1: string
	pos_detail_2: string
	pos_detail_3: string
	conjugated_type: string
	conjugated_form: string
	basic_form: string
	reading?: string | undefined
	pronunciation?: string | undefined
}

class IpadicFormatter {
	formatEntry(
		word_id: number,
		position: number,
		type: string,
		features: string[],
	): IpadicFeatures {
		const token = {} as IpadicFeatures
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

	formatUnknownEntry(
		word_id: number,
		position: number,
		type: string,
		features: string[],
		surface_form: string,
	) {
		const token = {} as IpadicFeatures
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
