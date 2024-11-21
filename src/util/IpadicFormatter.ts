export interface IpadicFeatures {
	/** 辞書内での単語ID */
	word_id: number
	/** 単語タイプ(辞書に登録されている単語ならKNOWN, 未知語ならUNKNOWN) */
	word_type: string
	/** 単語の開始位置 */
	word_position: number
	/** 表層形 */
	surface_form: string
	/** 品詞 */
	pos: string
	/** 品詞細分類1 */
	pos_detail_1: string
	/** 品詞細分類2 */
	pos_detail_2: string
	/** 品詞細分類3 */
	pos_detail_3: string
	/** 活用型 */
	conjugated_type: string
	/** 活用形 */
	conjugated_form: string
	/** 基本形 */
	basic_form: string
	/** 読み */
	reading?: string | undefined
	/** 発音 */
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
