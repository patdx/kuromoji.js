// src/viterbi/ViterbiNode.ts
var ViterbiNode = class {
  start_pos;
  length;
  name;
  cost;
  left_id;
  right_id;
  prev;
  surface_form;
  shortest_cost;
  type;
  constructor(node_name, node_cost, start_pos, length, type, left_id, right_id, surface_form) {
    this.name = node_name;
    this.cost = node_cost;
    this.start_pos = start_pos;
    this.length = length;
    this.left_id = left_id;
    this.right_id = right_id;
    this.prev = null;
    this.surface_form = surface_form;
    if (type === "BOS") {
      this.shortest_cost = 0;
    } else {
      this.shortest_cost = Number.MAX_VALUE;
    }
    this.type = type;
  }
};
var ViterbiNode_default = ViterbiNode;

// src/viterbi/ViterbiLattice.ts
var ViterbiLattice = class {
  nodes_end_at;
  eos_pos;
  constructor() {
    this.nodes_end_at = [];
    this.nodes_end_at[0] = [new ViterbiNode_default(-1, 0, 0, 0, "BOS", 0, 0, "")];
    this.eos_pos = 1;
  }
  append(node) {
    const last_pos = node.start_pos + node.length - 1;
    if (this.eos_pos < last_pos) {
      this.eos_pos = last_pos;
    }
    let prev_nodes = this.nodes_end_at[last_pos];
    if (prev_nodes == null) {
      prev_nodes = [];
    }
    prev_nodes.push(node);
    this.nodes_end_at[last_pos] = prev_nodes;
  }
  appendEos() {
    const last_index = this.nodes_end_at.length;
    this.eos_pos++;
    this.nodes_end_at[last_index] = [
      new ViterbiNode_default(-1, 0, this.eos_pos, 0, "EOS", 0, 0, "")
    ];
  }
};
var ViterbiLattice_default = ViterbiLattice;

// src/util/SurrogateAwareString.ts
var SurrogateAwareString = class _SurrogateAwareString {
  length;
  str;
  index_mapping;
  constructor(str) {
    this.str = str;
    this.index_mapping = [];
    for (let pos = 0; pos < str.length; pos++) {
      const ch = str.charAt(pos);
      this.index_mapping.push(pos);
      if (_SurrogateAwareString.isSurrogatePair(ch)) {
        pos++;
      }
    }
    this.length = this.index_mapping.length;
  }
  slice(index) {
    if (this.index_mapping.length <= index) {
      return "";
    }
    const surrogate_aware_index = this.index_mapping[index];
    return this.str.slice(surrogate_aware_index);
  }
  charAt(index) {
    if (this.str.length <= index) {
      return "";
    }
    const surrogate_aware_start_index = this.index_mapping[index];
    const surrogate_aware_end_index = this.index_mapping[index + 1];
    if (surrogate_aware_end_index == null) {
      return this.str.slice(surrogate_aware_start_index);
    }
    return this.str.slice(
      surrogate_aware_start_index,
      surrogate_aware_end_index
    );
  }
  charCodeAt(index) {
    if (this.index_mapping.length <= index) {
      return NaN;
    }
    const surrogate_aware_index = this.index_mapping[index];
    const upper = this.str.charCodeAt(surrogate_aware_index);
    let lower;
    if (upper >= 55296 && upper <= 56319 && surrogate_aware_index < this.str.length) {
      lower = this.str.charCodeAt(surrogate_aware_index + 1);
      if (lower >= 56320 && lower <= 57343) {
        return (upper - 55296) * 1024 + lower - 56320 + 65536;
      }
    }
    return upper;
  }
  toString() {
    return this.str;
  }
  static isSurrogatePair(ch) {
    const utf16_code = ch.charCodeAt(0);
    if (utf16_code >= 55296 && utf16_code <= 56319) {
      return true;
    } else {
      return false;
    }
  }
};
var SurrogateAwareString_default = SurrogateAwareString;

// src/viterbi/ViterbiBuilder.ts
var ViterbiBuilder = class {
  trie;
  token_info_dictionary;
  unknown_dictionary;
  constructor(dic) {
    this.trie = dic.trie;
    this.token_info_dictionary = dic.token_info_dictionary;
    this.unknown_dictionary = dic.unknown_dictionary;
  }
  build(sentence_str) {
    const lattice = new ViterbiLattice_default();
    const sentence = new SurrogateAwareString_default(sentence_str);
    let key, trie_id, left_id, right_id, word_cost;
    for (let pos = 0; pos < sentence.length; pos++) {
      const tail = sentence.slice(pos);
      const vocabulary = this.trie.commonPrefixSearch(tail);
      for (let n = 0; n < vocabulary.length; n++) {
        trie_id = vocabulary[n].v;
        key = vocabulary[n].k;
        const token_info_ids = this.token_info_dictionary.target_map[trie_id];
        for (let i = 0; i < token_info_ids.length; i++) {
          const token_info_id = parseInt(
            // @ts-expect-error Argument of type 'number' is not assignable to parameter of type 'string'.ts(2345)
            token_info_ids[i]
          );
          left_id = this.token_info_dictionary.dictionary.getShort(token_info_id);
          right_id = this.token_info_dictionary.dictionary.getShort(
            token_info_id + 2
          );
          word_cost = this.token_info_dictionary.dictionary.getShort(
            token_info_id + 4
          );
          lattice.append(
            new ViterbiNode_default(
              token_info_id,
              word_cost,
              pos + 1,
              key.length,
              "KNOWN",
              left_id,
              right_id,
              key
            )
          );
        }
      }
      const surrogate_aware_tail = new SurrogateAwareString_default(tail);
      const head_char = new SurrogateAwareString_default(surrogate_aware_tail.charAt(0));
      const head_char_class = this.unknown_dictionary.lookup(
        head_char.toString()
      );
      if (!head_char_class) {
        throw new Error("Unknown character: " + head_char);
      }
      if (vocabulary == null || vocabulary.length === 0 || head_char_class.is_always_invoke === 1) {
        key = head_char;
        if (head_char_class.is_grouping === 1 && 1 < surrogate_aware_tail.length) {
          for (let k = 1; k < surrogate_aware_tail.length; k++) {
            const next_char = surrogate_aware_tail.charAt(k);
            const next_char_class = this.unknown_dictionary.lookup(next_char);
            if (head_char_class.class_name !== next_char_class.class_name) {
              break;
            }
            key += next_char;
          }
        }
        const unk_ids = this.unknown_dictionary.target_map[head_char_class.class_id];
        for (let j = 0; j < unk_ids.length; j++) {
          const unk_id = parseInt(
            // @ts-expect-error Argument of type 'number' is not assignable to parameter of type 'string'.ts(2345)
            unk_ids[j]
          );
          left_id = this.unknown_dictionary.dictionary.getShort(unk_id);
          right_id = this.unknown_dictionary.dictionary.getShort(unk_id + 2);
          word_cost = this.unknown_dictionary.dictionary.getShort(unk_id + 4);
          lattice.append(
            new ViterbiNode_default(
              unk_id,
              word_cost,
              pos + 1,
              key.length,
              "UNKNOWN",
              left_id,
              right_id,
              key.toString()
            )
          );
        }
      }
    }
    lattice.appendEos();
    return lattice;
  }
};
var ViterbiBuilder_default = ViterbiBuilder;

// src/viterbi/ViterbiSearcher.ts
var ViterbiSearcher = class {
  connection_costs;
  constructor(connection_costs) {
    this.connection_costs = connection_costs;
  }
  search(lattice) {
    lattice = this.forward(lattice);
    return this.backward(lattice);
  }
  forward(lattice) {
    let i, j, k;
    for (i = 1; i <= lattice.eos_pos; i++) {
      const nodes = lattice.nodes_end_at[i];
      if (nodes == null) {
        continue;
      }
      for (j = 0; j < nodes.length; j++) {
        const node = nodes[j];
        let cost = Number.MAX_VALUE;
        let shortest_prev_node = null;
        const prev_nodes = lattice.nodes_end_at[node.start_pos - 1];
        if (prev_nodes == null) {
          continue;
        }
        for (k = 0; k < prev_nodes.length; k++) {
          const prev_node = prev_nodes[k];
          let edge_cost;
          if (node.left_id == null || prev_node.right_id == null) {
            console.log("Left or right is null");
            edge_cost = 0;
          } else {
            edge_cost = this.connection_costs.get(
              prev_node.right_id,
              node.left_id
            );
          }
          const _cost = prev_node.shortest_cost + edge_cost + node.cost;
          if (_cost < cost) {
            shortest_prev_node = prev_node;
            cost = _cost;
          }
        }
        node.prev = shortest_prev_node;
        node.shortest_cost = cost;
      }
    }
    return lattice;
  }
  backward(lattice) {
    const shortest_path = [];
    const eos = lattice.nodes_end_at[lattice.nodes_end_at.length - 1][0];
    let node_back = eos.prev;
    if (node_back == null) {
      return [];
    }
    while (node_back.type !== "BOS") {
      shortest_path.push(node_back);
      if (node_back.prev == null) {
        return [];
      }
      node_back = node_back.prev;
    }
    return shortest_path.reverse();
  }
};
var ViterbiSearcher_default = ViterbiSearcher;

// src/util/IpadicFormatter.ts
var IpadicFormatter = class {
  formatEntry(word_id, position, type, features) {
    const token = {};
    token.word_id = word_id;
    token.word_type = type;
    token.word_position = position;
    token.surface_form = features[0];
    token.pos = features[1];
    token.pos_detail_1 = features[2];
    token.pos_detail_2 = features[3];
    token.pos_detail_3 = features[4];
    token.conjugated_type = features[5];
    token.conjugated_form = features[6];
    token.basic_form = features[7];
    token.reading = features[8];
    token.pronunciation = features[9];
    return token;
  }
  formatUnknownEntry(word_id, position, type, features, surface_form) {
    const token = {};
    token.word_id = word_id;
    token.word_type = type;
    token.word_position = position;
    token.surface_form = surface_form;
    token.pos = features[1];
    token.pos_detail_1 = features[2];
    token.pos_detail_2 = features[3];
    token.pos_detail_3 = features[4];
    token.conjugated_type = features[5];
    token.conjugated_form = features[6];
    token.basic_form = features[7];
    return token;
  }
};
var IpadicFormatter_default = IpadicFormatter;

// src/Tokenizer.ts
var PUNCTUATION = /、|。/;
var Tokenizer = class _Tokenizer {
  token_info_dictionary;
  unknown_dictionary;
  viterbi_builder;
  viterbi_searcher;
  formatter;
  constructor(dic) {
    this.token_info_dictionary = dic.token_info_dictionary;
    this.unknown_dictionary = dic.unknown_dictionary;
    this.viterbi_builder = new ViterbiBuilder_default(dic);
    this.viterbi_searcher = new ViterbiSearcher_default(dic.connection_costs);
    this.formatter = new IpadicFormatter_default();
  }
  tokenize(text) {
    const sentences = _Tokenizer.splitByPunctuation(text);
    const tokens = [];
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      this.tokenizeForSentence(sentence, tokens);
    }
    return tokens;
  }
  tokenizeForSentence(sentence, tokens) {
    if (tokens == null) {
      tokens = [];
    }
    const lattice = this.getLattice(sentence);
    const best_path = this.viterbi_searcher.search(lattice);
    let last_pos = 0;
    if (tokens.length > 0) {
      last_pos = tokens[tokens.length - 1].word_position;
    }
    for (let j = 0; j < best_path.length; j++) {
      const node = best_path[j];
      let token;
      let features;
      let features_line;
      if (node.type === "KNOWN") {
        features_line = this.token_info_dictionary.getFeatures(
          // @ts-expect-error Argument of type 'number' is not assignable to parameter of type 'string'.ts(2345)
          node.name
        );
        if (features_line == null) {
          features = [];
        } else {
          features = features_line.split(",");
        }
        token = this.formatter.formatEntry(
          node.name,
          last_pos + node.start_pos,
          node.type,
          features
        );
      } else if (node.type === "UNKNOWN") {
        features_line = this.unknown_dictionary.getFeatures(
          // @ts-expect-error Argument of type 'number' is not assignable to parameter of type 'string'.ts(2345)
          node.name
        );
        if (features_line == null) {
          features = [];
        } else {
          features = features_line.split(",");
        }
        token = this.formatter.formatUnknownEntry(
          node.name,
          last_pos + node.start_pos,
          node.type,
          features,
          node.surface_form
        );
      } else {
        token = this.formatter.formatEntry(
          node.name,
          last_pos + node.start_pos,
          node.type,
          []
        );
      }
      tokens.push(token);
    }
    return tokens;
  }
  getLattice(text) {
    return this.viterbi_builder.build(text);
  }
  static splitByPunctuation(input) {
    const sentences = [];
    let tail = input;
    while (true) {
      if (tail === "") {
        break;
      }
      const index = tail.search(PUNCTUATION);
      if (index < 0) {
        sentences.push(tail);
        break;
      }
      sentences.push(tail.substring(0, index + 1));
      tail = tail.substring(index + 1);
    }
    return sentences;
  }
};
var Tokenizer_default = Tokenizer;

// src/vendor/doublearray/doublearray.js
var TERM_CHAR = "\0";
var TERM_CODE = 0;
var ROOT_ID = 0;
var NOT_FOUND = -1;
var BASE_SIGNED = true;
var CHECK_SIGNED = true;
var BASE_BYTES = 4;
var CHECK_BYTES = 4;
var MEMORY_EXPAND_RATIO = 2;
var newBC = function(initial_size) {
  if (initial_size == null) {
    initial_size = 1024;
  }
  let initBase = function(_base, start, end) {
    for (let i = start; i < end; i++) {
      _base[i] = -i + 1;
    }
    if (0 < check.array[check.array.length - 1]) {
      let last_used_id = check.array.length - 2;
      while (0 < check.array[last_used_id]) {
        last_used_id--;
      }
      _base[start] = -last_used_id;
    }
  };
  let initCheck = function(_check, start, end) {
    for (let i = start; i < end; i++) {
      _check[i] = -i - 1;
    }
  };
  let realloc = function(min_size) {
    let new_size = min_size * MEMORY_EXPAND_RATIO;
    let base_new_array = newArrayBuffer(base.signed, base.bytes, new_size);
    initBase(base_new_array, base.array.length, new_size);
    base_new_array.set(base.array);
    base.array = null;
    base.array = base_new_array;
    let check_new_array = newArrayBuffer(check.signed, check.bytes, new_size);
    initCheck(check_new_array, check.array.length, new_size);
    check_new_array.set(check.array);
    check.array = null;
    check.array = check_new_array;
  };
  let first_unused_node = ROOT_ID + 1;
  var base = {
    signed: BASE_SIGNED,
    bytes: BASE_BYTES,
    array: newArrayBuffer(BASE_SIGNED, BASE_BYTES, initial_size)
  };
  var check = {
    signed: CHECK_SIGNED,
    bytes: CHECK_BYTES,
    array: newArrayBuffer(CHECK_SIGNED, CHECK_BYTES, initial_size)
  };
  base.array[ROOT_ID] = 1;
  check.array[ROOT_ID] = ROOT_ID;
  initBase(base.array, ROOT_ID + 1, base.array.length);
  initCheck(check.array, ROOT_ID + 1, check.array.length);
  return {
    getBaseBuffer: function() {
      return base.array;
    },
    getCheckBuffer: function() {
      return check.array;
    },
    loadBaseBuffer: function(base_buffer) {
      base.array = base_buffer;
      return this;
    },
    loadCheckBuffer: function(check_buffer) {
      check.array = check_buffer;
      return this;
    },
    size: function() {
      return Math.max(base.array.length, check.array.length);
    },
    getBase: function(index) {
      if (base.array.length - 1 < index) {
        return -index + 1;
      }
      return base.array[index];
    },
    getCheck: function(index) {
      if (check.array.length - 1 < index) {
        return -index - 1;
      }
      return check.array[index];
    },
    setBase: function(index, base_value) {
      if (base.array.length - 1 < index) {
        realloc(index);
      }
      base.array[index] = base_value;
    },
    setCheck: function(index, check_value) {
      if (check.array.length - 1 < index) {
        realloc(index);
      }
      check.array[index] = check_value;
    },
    setFirstUnusedNode: function(index) {
      first_unused_node = index;
    },
    getFirstUnusedNode: function() {
      return first_unused_node;
    },
    shrink: function() {
      let last_index = this.size() - 1;
      while (true) {
        if (0 <= check.array[last_index]) {
          break;
        }
        last_index--;
      }
      base.array = base.array.subarray(0, last_index + 2);
      check.array = check.array.subarray(0, last_index + 2);
    },
    calc: function() {
      let unused_count = 0;
      let size = check.array.length;
      for (let i = 0; i < size; i++) {
        if (check.array[i] < 0) {
          unused_count++;
        }
      }
      return {
        all: size,
        unused: unused_count,
        efficiency: (size - unused_count) / size
      };
    },
    dump: function() {
      let dump_base = "";
      let dump_check = "";
      let i;
      for (i = 0; i < base.array.length; i++) {
        dump_base = dump_base + " " + this.getBase(i);
      }
      for (i = 0; i < check.array.length; i++) {
        dump_check = dump_check + " " + this.getCheck(i);
      }
      console.log("base:" + dump_base);
      console.log("chck:" + dump_check);
      return "base:" + dump_base + " chck:" + dump_check;
    }
  };
};
function DoubleArrayBuilder(initial_size) {
  this.bc = newBC(initial_size);
  this.keys = [];
}
DoubleArrayBuilder.prototype.append = function(key, record) {
  this.keys.push({ k: key, v: record });
  return this;
};
DoubleArrayBuilder.prototype.build = function(keys, sorted) {
  if (keys == null) {
    keys = this.keys;
  }
  if (keys == null) {
    return new DoubleArray(this.bc);
  }
  if (sorted == null) {
    sorted = false;
  }
  let buff_keys = keys.map(function(k) {
    return {
      k: stringToUtf8Bytes(k.k + TERM_CHAR),
      v: k.v
    };
  });
  if (sorted) {
    this.keys = buff_keys;
  } else {
    this.keys = buff_keys.sort(function(k1, k2) {
      const b1 = k1.k;
      const b2 = k2.k;
      const min_length = Math.min(b1.length, b2.length);
      for (let pos = 0; pos < min_length; pos++) {
        if (b1[pos] === b2[pos]) {
          continue;
        }
        return b1[pos] - b2[pos];
      }
      return b1.length - b2.length;
    });
  }
  buff_keys = null;
  this._build(ROOT_ID, 0, 0, this.keys.length);
  return new DoubleArray(this.bc);
};
DoubleArrayBuilder.prototype._build = function(parent_index, position, start, length) {
  const children_info = this.getChildrenInfo(position, start, length);
  const _base = this.findAllocatableBase(children_info);
  this.setBC(parent_index, children_info, _base);
  for (let i = 0; i < children_info.length; i = i + 3) {
    const child_code = children_info[i];
    if (child_code === TERM_CODE) {
      continue;
    }
    const child_start = children_info[i + 1];
    const child_len = children_info[i + 2];
    const child_index = _base + child_code;
    this._build(child_index, position + 1, child_start, child_len);
  }
};
DoubleArrayBuilder.prototype.getChildrenInfo = function(position, start, length) {
  let current_char = this.keys[start].k[position];
  let i = 0;
  let children_info = new Int32Array(length * 3);
  children_info[i++] = current_char;
  children_info[i++] = start;
  let next_pos = start;
  let start_pos = start;
  for (; next_pos < start + length; next_pos++) {
    const next_char = this.keys[next_pos].k[position];
    if (current_char !== next_char) {
      children_info[i++] = next_pos - start_pos;
      children_info[i++] = next_char;
      children_info[i++] = next_pos;
      current_char = next_char;
      start_pos = next_pos;
    }
  }
  children_info[i++] = next_pos - start_pos;
  children_info = children_info.subarray(0, i);
  return children_info;
};
DoubleArrayBuilder.prototype.setBC = function(parent_id, children_info, _base) {
  const bc = this.bc;
  bc.setBase(parent_id, _base);
  let i;
  for (i = 0; i < children_info.length; i = i + 3) {
    const code = children_info[i];
    const child_id = _base + code;
    const prev_unused_id = -bc.getBase(child_id);
    const next_unused_id = -bc.getCheck(child_id);
    if (child_id !== bc.getFirstUnusedNode()) {
      bc.setCheck(prev_unused_id, -next_unused_id);
    } else {
      bc.setFirstUnusedNode(next_unused_id);
    }
    bc.setBase(next_unused_id, -prev_unused_id);
    const check = parent_id;
    bc.setCheck(child_id, check);
    if (code === TERM_CODE) {
      const start_pos = children_info[i + 1];
      let value = this.keys[start_pos].v;
      if (value == null) {
        value = 0;
      }
      const base = -value - 1;
      bc.setBase(child_id, base);
    }
  }
};
DoubleArrayBuilder.prototype.findAllocatableBase = function(children_info) {
  const bc = this.bc;
  let _base;
  let curr = bc.getFirstUnusedNode();
  while (true) {
    _base = curr - children_info[0];
    if (_base < 0) {
      curr = -bc.getCheck(curr);
      continue;
    }
    let empty_area_found = true;
    for (let i = 0; i < children_info.length; i = i + 3) {
      const code = children_info[i];
      const candidate_id = _base + code;
      if (!this.isUnusedNode(candidate_id)) {
        curr = -bc.getCheck(curr);
        empty_area_found = false;
        break;
      }
    }
    if (empty_area_found) {
      return _base;
    }
  }
};
DoubleArrayBuilder.prototype.isUnusedNode = function(index) {
  const bc = this.bc;
  const check = bc.getCheck(index);
  if (index === ROOT_ID) {
    return false;
  }
  if (check < 0) {
    return true;
  }
  return false;
};
function DoubleArray(bc) {
  this.bc = bc;
  this.bc.shrink();
}
DoubleArray.prototype.contain = function(key) {
  const bc = this.bc;
  key += TERM_CHAR;
  const buffer = stringToUtf8Bytes(key);
  let parent = ROOT_ID;
  let child = NOT_FOUND;
  for (let i = 0; i < buffer.length; i++) {
    const code = buffer[i];
    child = this.traverse(parent, code);
    if (child === NOT_FOUND) {
      return false;
    }
    if (bc.getBase(child) <= 0) {
      return true;
    } else {
      parent = child;
      continue;
    }
  }
  return false;
};
DoubleArray.prototype.lookup = function(key) {
  key += TERM_CHAR;
  const buffer = stringToUtf8Bytes(key);
  let parent = ROOT_ID;
  let child = NOT_FOUND;
  for (let i = 0; i < buffer.length; i++) {
    const code = buffer[i];
    child = this.traverse(parent, code);
    if (child === NOT_FOUND) {
      return NOT_FOUND;
    }
    parent = child;
  }
  const base = this.bc.getBase(child);
  if (base <= 0) {
    return -base - 1;
  } else {
    return NOT_FOUND;
  }
};
DoubleArray.prototype.commonPrefixSearch = function(key) {
  const buffer = stringToUtf8Bytes(key);
  let parent = ROOT_ID;
  let child = NOT_FOUND;
  const result = [];
  for (let i = 0; i < buffer.length; i++) {
    const code = buffer[i];
    child = this.traverse(parent, code);
    if (child !== NOT_FOUND) {
      parent = child;
      const grand_child = this.traverse(child, TERM_CODE);
      if (grand_child !== NOT_FOUND) {
        const base = this.bc.getBase(grand_child);
        const r = {};
        if (base <= 0) {
          r.v = -base - 1;
        }
        r.k = utf8BytesToString(arrayCopy(buffer, 0, i + 1));
        result.push(r);
      }
      continue;
    } else {
      break;
    }
  }
  return result;
};
DoubleArray.prototype.traverse = function(parent, code) {
  const child = this.bc.getBase(parent) + code;
  if (this.bc.getCheck(child) === parent) {
    return child;
  } else {
    return NOT_FOUND;
  }
};
DoubleArray.prototype.size = function() {
  return this.bc.size();
};
DoubleArray.prototype.calc = function() {
  return this.bc.calc();
};
DoubleArray.prototype.dump = function() {
  return this.bc.dump();
};
var newArrayBuffer = function(signed, bytes, size) {
  if (signed) {
    switch (bytes) {
      case 1:
        return new Int8Array(size);
      case 2:
        return new Int16Array(size);
      case 4:
        return new Int32Array(size);
      default:
        throw new RangeError(
          "Invalid newArray parameter element_bytes:" + bytes
        );
    }
  } else {
    switch (bytes) {
      case 1:
        return new Uint8Array(size);
      case 2:
        return new Uint16Array(size);
      case 4:
        return new Uint32Array(size);
      default:
        throw new RangeError(
          "Invalid newArray parameter element_bytes:" + bytes
        );
    }
  }
};
var arrayCopy = function(src, src_offset, length) {
  const buffer = new ArrayBuffer(length);
  const dstU8 = new Uint8Array(buffer, 0, length);
  const srcU8 = src.subarray(src_offset, length);
  dstU8.set(srcU8);
  return dstU8;
};
var stringToUtf8Bytes = function(str) {
  const bytes = new Uint8Array(new ArrayBuffer(str.length * 4));
  let i = 0, j = 0;
  while (i < str.length) {
    var unicode_code;
    const utf16_code = str.charCodeAt(i++);
    if (utf16_code >= 55296 && utf16_code <= 56319) {
      const upper = utf16_code;
      const lower = str.charCodeAt(i++);
      if (lower >= 56320 && lower <= 57343) {
        unicode_code = (upper - 55296) * (1 << 10) + (1 << 16) + (lower - 56320);
      } else {
        return null;
      }
    } else {
      unicode_code = utf16_code;
    }
    if (unicode_code < 128) {
      bytes[j++] = unicode_code;
    } else if (unicode_code < 1 << 11) {
      bytes[j++] = unicode_code >>> 6 | 192;
      bytes[j++] = unicode_code & 63 | 128;
    } else if (unicode_code < 1 << 16) {
      bytes[j++] = unicode_code >>> 12 | 224;
      bytes[j++] = unicode_code >> 6 & 63 | 128;
      bytes[j++] = unicode_code & 63 | 128;
    } else if (unicode_code < 1 << 21) {
      bytes[j++] = unicode_code >>> 18 | 240;
      bytes[j++] = unicode_code >> 12 & 63 | 128;
      bytes[j++] = unicode_code >> 6 & 63 | 128;
      bytes[j++] = unicode_code & 63 | 128;
    } else {
    }
  }
  return bytes.subarray(0, j);
};
var utf8BytesToString = function(bytes) {
  let str = "";
  let code, b1, b2, b3, b4, upper, lower;
  let i = 0;
  while (i < bytes.length) {
    b1 = bytes[i++];
    if (b1 < 128) {
      code = b1;
    } else if (b1 >> 5 === 6) {
      b2 = bytes[i++];
      code = (b1 & 31) << 6 | b2 & 63;
    } else if (b1 >> 4 === 14) {
      b2 = bytes[i++];
      b3 = bytes[i++];
      code = (b1 & 15) << 12 | (b2 & 63) << 6 | b3 & 63;
    } else {
      b2 = bytes[i++];
      b3 = bytes[i++];
      b4 = bytes[i++];
      code = (b1 & 7) << 18 | (b2 & 63) << 12 | (b3 & 63) << 6 | b4 & 63;
    }
    if (code < 65536) {
      str += String.fromCharCode(code);
    } else {
      code -= 65536;
      upper = 55296 | code >> 10;
      lower = 56320 | code & 1023;
      str += String.fromCharCode(upper, lower);
    }
  }
  return str;
};
function builder(initial_size) {
  return new DoubleArrayBuilder(initial_size);
}
function load(base_buffer, check_buffer) {
  let bc = newBC(0);
  bc.loadBaseBuffer(base_buffer);
  bc.loadCheckBuffer(check_buffer);
  return new DoubleArray(bc);
}

// src/util/ByteBuffer.ts
var stringToUtf8Bytes2 = function(str) {
  const bytes = new Uint8Array(str.length * 4);
  let i = 0, j = 0;
  while (i < str.length) {
    let unicode_code;
    const utf16_code = str.charCodeAt(i++);
    if (utf16_code >= 55296 && utf16_code <= 56319) {
      const upper = utf16_code;
      const lower = str.charCodeAt(i++);
      if (lower >= 56320 && lower <= 57343) {
        unicode_code = (upper - 55296) * (1 << 10) + (1 << 16) + (lower - 56320);
      } else {
        return null;
      }
    } else {
      unicode_code = utf16_code;
    }
    if (unicode_code < 128) {
      bytes[j++] = unicode_code;
    } else if (unicode_code < 1 << 11) {
      bytes[j++] = unicode_code >>> 6 | 192;
      bytes[j++] = unicode_code & 63 | 128;
    } else if (unicode_code < 1 << 16) {
      bytes[j++] = unicode_code >>> 12 | 224;
      bytes[j++] = unicode_code >> 6 & 63 | 128;
      bytes[j++] = unicode_code & 63 | 128;
    } else if (unicode_code < 1 << 21) {
      bytes[j++] = unicode_code >>> 18 | 240;
      bytes[j++] = unicode_code >> 12 & 63 | 128;
      bytes[j++] = unicode_code >> 6 & 63 | 128;
      bytes[j++] = unicode_code & 63 | 128;
    } else {
    }
  }
  return bytes.subarray(0, j);
};
var utf8BytesToString2 = function(bytes) {
  let str = "";
  let code, b1, b2, b3, b4, upper, lower;
  let i = 0;
  while (i < bytes.length) {
    b1 = bytes[i++];
    if (b1 < 128) {
      code = b1;
    } else if (b1 >> 5 === 6) {
      b2 = bytes[i++];
      code = (b1 & 31) << 6 | b2 & 63;
    } else if (b1 >> 4 === 14) {
      b2 = bytes[i++];
      b3 = bytes[i++];
      code = (b1 & 15) << 12 | (b2 & 63) << 6 | b3 & 63;
    } else {
      b2 = bytes[i++];
      b3 = bytes[i++];
      b4 = bytes[i++];
      code = (b1 & 7) << 18 | (b2 & 63) << 12 | (b3 & 63) << 6 | b4 & 63;
    }
    if (code < 65536) {
      str += String.fromCharCode(code);
    } else {
      code -= 65536;
      upper = 55296 | code >> 10;
      lower = 56320 | code & 1023;
      str += String.fromCharCode(upper, lower);
    }
  }
  return str;
};
var ByteBuffer = class {
  buffer;
  position;
  constructor(arg) {
    let initial_size;
    if (arg == null) {
      initial_size = 1024 * 1024;
    } else if (typeof arg === "number") {
      initial_size = arg;
    } else if (arg instanceof Uint8Array) {
      this.buffer = arg;
      this.position = 0;
      return;
    } else {
      throw typeof arg + " is invalid parameter type for ByteBuffer constructor";
    }
    this.buffer = new Uint8Array(initial_size);
    this.position = 0;
  }
  size() {
    return this.buffer.length;
  }
  reallocate() {
    const new_array = new Uint8Array(this.buffer.length * 2);
    new_array.set(this.buffer);
    this.buffer = new_array;
  }
  shrink() {
    this.buffer = this.buffer.subarray(0, this.position);
    return this.buffer;
  }
  put(b) {
    if (this.buffer.length < this.position + 1) {
      this.reallocate();
    }
    this.buffer[this.position++] = b;
  }
  get(index) {
    if (index == null) {
      index = this.position;
      this.position += 1;
    }
    if (this.buffer.length < index + 1) {
      return 0;
    }
    return this.buffer[index];
  }
  putShort(num) {
    if (65535 < num) {
      throw num + " is over short value";
    }
    const lower = 255 & num;
    const upper = (65280 & num) >> 8;
    this.put(lower);
    this.put(upper);
  }
  getShort(index) {
    if (index == null) {
      index = this.position;
      this.position += 2;
    }
    if (this.buffer.length < index + 2) {
      return 0;
    }
    const lower = this.buffer[index];
    const upper = this.buffer[index + 1];
    let value = (upper << 8) + lower;
    if (value & 32768) {
      value = -(value - 1 ^ 65535);
    }
    return value;
  }
  putInt(num) {
    if (4294967295 < num) {
      throw num + " is over integer value";
    }
    const b0 = 255 & num;
    const b1 = (65280 & num) >> 8;
    const b2 = (16711680 & num) >> 16;
    const b3 = (4278190080 & num) >> 24;
    this.put(b0);
    this.put(b1);
    this.put(b2);
    this.put(b3);
  }
  getInt(index) {
    if (index == null) {
      index = this.position;
      this.position += 4;
    }
    if (this.buffer.length < index + 4) {
      return 0;
    }
    const b0 = this.buffer[index];
    const b1 = this.buffer[index + 1];
    const b2 = this.buffer[index + 2];
    const b3 = this.buffer[index + 3];
    return (b3 << 24) + (b2 << 16) + (b1 << 8) + b0;
  }
  readInt() {
    const pos = this.position;
    this.position += 4;
    return this.getInt(pos);
  }
  putString(str) {
    const bytes = stringToUtf8Bytes2(str);
    for (let i = 0; i < bytes.length; i++) {
      this.put(bytes[i]);
    }
    this.put(0);
  }
  getString(index) {
    const buf = [];
    let ch;
    if (index == null) {
      index = this.position;
    }
    while (true) {
      if (this.buffer.length < index + 1) {
        break;
      }
      ch = this.get(index++);
      if (ch === 0) {
        break;
      } else {
        buf.push(ch);
      }
    }
    this.position = index;
    return utf8BytesToString2(buf);
  }
};
var ByteBuffer_default = ByteBuffer;

// src/dict/TokenInfoDictionary.ts
var TokenInfoDictionary = class {
  dictionary;
  target_map;
  pos_buffer;
  constructor() {
    this.dictionary = new ByteBuffer_default(10 * 1024 * 1024);
    this.target_map = {};
    this.pos_buffer = new ByteBuffer_default(10 * 1024 * 1024);
  }
  buildDictionary(entries) {
    const dictionary_entries = {};
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (entry.length < 4) {
        continue;
      }
      const surface_form = entry[0];
      const left_id = entry[1];
      const right_id = entry[2];
      const word_cost = entry[3];
      const feature = entry.slice(4).join(",");
      if (!isFinite(left_id) || !isFinite(right_id) || !isFinite(word_cost)) {
        console.log(entry);
      }
      const token_info_id = this.put(
        left_id,
        right_id,
        word_cost,
        surface_form,
        feature
      );
      dictionary_entries[token_info_id] = surface_form;
    }
    this.dictionary.shrink();
    this.pos_buffer.shrink();
    return dictionary_entries;
  }
  put(left_id, right_id, word_cost, surface_form, feature) {
    const token_info_id = this.dictionary.position;
    const pos_id = this.pos_buffer.position;
    this.dictionary.putShort(left_id);
    this.dictionary.putShort(right_id);
    this.dictionary.putShort(word_cost);
    this.dictionary.putInt(pos_id);
    this.pos_buffer.putString(surface_form + "," + feature);
    return token_info_id;
  }
  addMapping(source, target) {
    let mapping = this.target_map[source];
    if (mapping == null) {
      mapping = [];
    }
    mapping.push(target);
    this.target_map[source] = mapping;
  }
  targetMapToBuffer() {
    const buffer = new ByteBuffer_default();
    const map_keys_size = Object.keys(this.target_map).length;
    buffer.putInt(map_keys_size);
    for (const key in this.target_map) {
      const values = this.target_map[key];
      const map_values_size = values.length;
      buffer.putInt(parseInt(key));
      buffer.putInt(map_values_size);
      for (let i = 0; i < values.length; i++) {
        buffer.putInt(values[i]);
      }
    }
    return buffer.shrink();
  }
  loadDictionary(array_buffer) {
    this.dictionary = new ByteBuffer_default(array_buffer);
    return this;
  }
  loadPosVector(array_buffer) {
    this.pos_buffer = new ByteBuffer_default(array_buffer);
    return this;
  }
  loadTargetMap(array_buffer) {
    const buffer = new ByteBuffer_default(array_buffer);
    buffer.position = 0;
    this.target_map = {};
    buffer.readInt();
    while (true) {
      if (buffer.buffer.length < buffer.position + 1) {
        break;
      }
      const key = buffer.readInt();
      const map_values_size = buffer.readInt();
      for (let i = 0; i < map_values_size; i++) {
        const value = buffer.readInt();
        this.addMapping(key, value);
      }
    }
    return this;
  }
  getFeatures(token_info_id_str) {
    const token_info_id = parseInt(token_info_id_str);
    if (isNaN(token_info_id)) {
      return "";
    }
    const pos_id = this.dictionary.getInt(token_info_id + 6);
    return this.pos_buffer.getString(pos_id);
  }
};
var TokenInfoDictionary_default = TokenInfoDictionary;

// src/dict/ConnectionCosts.ts
var ConnectionCosts = class {
  forward_dimension;
  backward_dimension;
  buffer;
  constructor(forward_dimension, backward_dimension) {
    this.forward_dimension = forward_dimension;
    this.backward_dimension = backward_dimension;
    this.buffer = new Int16Array(forward_dimension * backward_dimension + 2);
    this.buffer[0] = forward_dimension;
    this.buffer[1] = backward_dimension;
  }
  put(forward_id, backward_id, cost) {
    const index = forward_id * this.backward_dimension + backward_id + 2;
    if (this.buffer.length < index + 1) {
      throw "ConnectionCosts buffer overflow";
    }
    this.buffer[index] = cost;
  }
  get(forward_id, backward_id) {
    const index = forward_id * this.backward_dimension + backward_id + 2;
    if (this.buffer.length < index + 1) {
      throw "ConnectionCosts buffer overflow";
    }
    return this.buffer[index];
  }
  loadConnectionCosts(connection_costs_buffer) {
    this.forward_dimension = connection_costs_buffer[0];
    this.backward_dimension = connection_costs_buffer[1];
    this.buffer = connection_costs_buffer;
  }
};
var ConnectionCosts_default = ConnectionCosts;

// src/dict/CharacterClass.ts
var CharacterClass = class {
  class_id;
  class_name;
  is_always_invoke;
  is_grouping;
  max_length;
  constructor(class_id, class_name, is_always_invoke, is_grouping, max_length) {
    this.class_id = class_id;
    this.class_name = class_name;
    this.is_always_invoke = is_always_invoke;
    this.is_grouping = is_grouping;
    this.max_length = max_length;
  }
};
var CharacterClass_default = CharacterClass;

// src/dict/InvokeDefinitionMap.ts
var InvokeDefinitionMap = class _InvokeDefinitionMap {
  map;
  lookup_table;
  constructor() {
    this.map = [];
    this.lookup_table = {};
  }
  init(character_category_definition) {
    if (character_category_definition == null) {
      return;
    }
    for (let i = 0; i < character_category_definition.length; i++) {
      const character_class = character_category_definition[i];
      this.map[i] = character_class;
      this.lookup_table[character_class.class_name] = i;
    }
  }
  getCharacterClass(class_id) {
    return this.map[class_id];
  }
  lookup(class_name) {
    const class_id = this.lookup_table[class_name];
    if (class_id == null) {
      return null;
    }
    return class_id;
  }
  toBuffer() {
    const buffer = new ByteBuffer_default();
    for (let i = 0; i < this.map.length; i++) {
      const char_class = this.map[i];
      buffer.put(char_class.is_always_invoke);
      buffer.put(char_class.is_grouping);
      buffer.putInt(char_class.max_length);
      buffer.putString(char_class.class_name);
    }
    buffer.shrink();
    return buffer.buffer;
  }
  static load(invoke_def_buffer) {
    const invoke_def = new _InvokeDefinitionMap();
    const character_category_definition = [];
    const buffer = new ByteBuffer_default(invoke_def_buffer);
    while (buffer.position + 1 < buffer.size()) {
      const class_id = character_category_definition.length;
      const is_always_invoke = buffer.get();
      const is_grouping = buffer.get();
      const max_length = buffer.getInt();
      const class_name = buffer.getString();
      character_category_definition.push(
        new CharacterClass_default(
          class_id,
          class_name,
          is_always_invoke,
          is_grouping,
          max_length
        )
      );
    }
    invoke_def.init(character_category_definition);
    return invoke_def;
  }
};
var InvokeDefinitionMap_default = InvokeDefinitionMap;

// src/dict/CharacterDefinition.ts
var DEFAULT_CATEGORY = "DEFAULT";
var CharacterDefinition = class _CharacterDefinition {
  character_category_map;
  compatible_category_map;
  invoke_definition_map;
  constructor() {
    this.character_category_map = new Uint8Array(65536);
    this.compatible_category_map = new Uint32Array(65536);
    this.invoke_definition_map = null;
  }
  initCategoryMappings(category_mapping) {
    let code_point;
    if (category_mapping != null) {
      for (let i = 0; i < category_mapping.length; i++) {
        const mapping = category_mapping[i];
        const end = mapping.end || mapping.start;
        for (code_point = mapping.start; code_point <= end; code_point++) {
          this.character_category_map[code_point] = this.invoke_definition_map.lookup(mapping.default);
          for (let j = 0; j < mapping.compatible.length; j++) {
            let bitset = this.compatible_category_map[code_point];
            const compatible_category = mapping.compatible[j];
            if (compatible_category == null) {
              continue;
            }
            const class_id = this.invoke_definition_map.lookup(compatible_category);
            if (class_id == null) {
              continue;
            }
            const class_id_bit = 1 << class_id;
            bitset = bitset | class_id_bit;
            this.compatible_category_map[code_point] = bitset;
          }
        }
      }
    }
    const default_id = this.invoke_definition_map.lookup(DEFAULT_CATEGORY);
    if (default_id == null) {
      return;
    }
    for (code_point = 0; code_point < this.character_category_map.length; code_point++) {
      if (this.character_category_map[code_point] === 0) {
        this.character_category_map[code_point] = 1 << default_id;
      }
    }
  }
  lookupCompatibleCategory(ch) {
    const classes = [];
    const code = ch.charCodeAt(0);
    let integer;
    if (code < this.compatible_category_map.length) {
      integer = this.compatible_category_map[code];
    }
    if (integer == null || integer === 0) {
      return classes;
    }
    for (let bit = 0; bit < 32; bit++) {
      if (integer << 31 - bit >>> 31 === 1) {
        const character_class = this.invoke_definition_map.getCharacterClass(bit);
        if (character_class == null) {
          continue;
        }
        classes.push(character_class);
      }
    }
    return classes;
  }
  lookup(ch) {
    let class_id;
    const code = ch.charCodeAt(0);
    if (SurrogateAwareString_default.isSurrogatePair(ch)) {
      class_id = this.invoke_definition_map.lookup(DEFAULT_CATEGORY);
    } else if (code < this.character_category_map.length) {
      class_id = this.character_category_map[code];
    }
    if (class_id == null) {
      class_id = this.invoke_definition_map.lookup(DEFAULT_CATEGORY);
    }
    return this.invoke_definition_map.getCharacterClass(class_id);
  }
  static load(cat_map_buffer, compat_cat_map_buffer, invoke_def_buffer) {
    const char_def = new _CharacterDefinition();
    char_def.character_category_map = cat_map_buffer;
    char_def.compatible_category_map = compat_cat_map_buffer;
    char_def.invoke_definition_map = InvokeDefinitionMap_default.load(invoke_def_buffer);
    return char_def;
  }
  static parseCharCategory(class_id, parsed_category_def) {
    const category = parsed_category_def[1];
    const invoke = parseInt(parsed_category_def[2]);
    const grouping = parseInt(parsed_category_def[3]);
    const max_length = parseInt(parsed_category_def[4]);
    if (!isFinite(invoke) || invoke !== 0 && invoke !== 1) {
      console.log("char.def parse error. INVOKE is 0 or 1 in:" + invoke);
      return null;
    }
    if (!isFinite(grouping) || grouping !== 0 && grouping !== 1) {
      console.log("char.def parse error. GROUP is 0 or 1 in:" + grouping);
      return null;
    }
    if (!isFinite(max_length) || max_length < 0) {
      console.log("char.def parse error. LENGTH is 1 to n:" + max_length);
      return null;
    }
    const is_invoke = invoke === 1;
    const is_grouping = grouping === 1;
    return new CharacterClass_default(
      class_id,
      category,
      is_invoke,
      is_grouping,
      max_length
    );
  }
  static parseCategoryMapping(parsed_category_mapping) {
    const start = parseInt(parsed_category_mapping[1]);
    const default_category = parsed_category_mapping[2];
    const compatible_category = 3 < parsed_category_mapping.length ? parsed_category_mapping.slice(3) : [];
    if (!isFinite(start) || start < 0 || start > 65535) {
      console.log("char.def parse error. CODE is invalid:" + start);
    }
    return {
      start,
      default: default_category,
      compatible: compatible_category
    };
  }
  static parseRangeCategoryMapping(parsed_category_mapping) {
    const start = parseInt(parsed_category_mapping[1]);
    const end = parseInt(parsed_category_mapping[2]);
    const default_category = parsed_category_mapping[3];
    const compatible_category = 4 < parsed_category_mapping.length ? parsed_category_mapping.slice(4) : [];
    if (!isFinite(start) || start < 0 || start > 65535) {
      console.log("char.def parse error. CODE is invalid:" + start);
    }
    if (!isFinite(end) || end < 0 || end > 65535) {
      console.log("char.def parse error. CODE is invalid:" + end);
    }
    return {
      start,
      end,
      default: default_category,
      compatible: compatible_category
    };
  }
};
var CharacterDefinition_default = CharacterDefinition;

// src/dict/UnknownDictionary.ts
var UnknownDictionary = class extends TokenInfoDictionary_default {
  character_definition;
  constructor() {
    super();
    this.dictionary = new ByteBuffer_default(10 * 1024 * 1024);
    this.target_map = {};
    this.pos_buffer = new ByteBuffer_default(10 * 1024 * 1024);
    this.character_definition = null;
  }
  characterDefinition(character_definition) {
    this.character_definition = character_definition;
    return this;
  }
  lookup(ch) {
    return this.character_definition?.lookup(ch);
  }
  lookupCompatibleCategory(ch) {
    return this.character_definition?.lookupCompatibleCategory(ch);
  }
  loadUnknownDictionaries(unk_buffer, unk_pos_buffer, unk_map_buffer, cat_map_buffer, compat_cat_map_buffer, invoke_def_buffer) {
    this.loadDictionary(unk_buffer);
    this.loadPosVector(unk_pos_buffer);
    this.loadTargetMap(unk_map_buffer);
    this.character_definition = CharacterDefinition_default.load(
      cat_map_buffer,
      compat_cat_map_buffer,
      invoke_def_buffer
    );
  }
};
var UnknownDictionary_default = UnknownDictionary;

// src/dict/DynamicDictionaries.ts
var DynamicDictionaries = class {
  trie;
  token_info_dictionary;
  connection_costs;
  unknown_dictionary;
  constructor(trie, token_info_dictionary, connection_costs, unknown_dictionary) {
    if (trie != null) {
      this.trie = trie;
    } else {
      this.trie = builder(0).build([{ k: "", v: 1 }]);
    }
    if (token_info_dictionary != null) {
      this.token_info_dictionary = token_info_dictionary;
    } else {
      this.token_info_dictionary = new TokenInfoDictionary_default();
    }
    if (connection_costs != null) {
      this.connection_costs = connection_costs;
    } else {
      this.connection_costs = new ConnectionCosts_default(0, 0);
    }
    if (unknown_dictionary != null) {
      this.unknown_dictionary = unknown_dictionary;
    } else {
      this.unknown_dictionary = new UnknownDictionary_default();
    }
  }
  loadTrie(base_buffer, check_buffer) {
    this.trie = load(base_buffer, check_buffer);
    return this;
  }
  loadTokenInfoDictionaries(token_info_buffer, pos_buffer, target_map_buffer) {
    this.token_info_dictionary.loadDictionary(token_info_buffer);
    this.token_info_dictionary.loadPosVector(pos_buffer);
    this.token_info_dictionary.loadTargetMap(target_map_buffer);
    return this;
  }
  loadConnectionCosts(cc_buffer) {
    this.connection_costs.loadConnectionCosts(cc_buffer);
    return this;
  }
  loadUnknownDictionaries(unk_buffer, unk_pos_buffer, unk_map_buffer, cat_map_buffer, compat_cat_map_buffer, invoke_def_buffer) {
    this.unknown_dictionary.loadUnknownDictionaries(
      unk_buffer,
      unk_pos_buffer,
      unk_map_buffer,
      cat_map_buffer,
      compat_cat_map_buffer,
      invoke_def_buffer
    );
    return this;
  }
};
var DynamicDictionaries_default = DynamicDictionaries;

// src/loader/DictionaryLoader.ts
async function loadDictionary(config) {
  const dic = new DynamicDictionaries_default();
  async function loadTrie() {
    const filenames = ["base.dat.gz", "check.dat.gz"];
    const buffers = await Promise.all(
      filenames.map((filename) => config.loadArrayBuffer(filename))
    );
    const base_buffer = new Int32Array(buffers[0]);
    const check_buffer = new Int32Array(buffers[1]);
    dic.loadTrie(base_buffer, check_buffer);
  }
  async function loadInfo() {
    const filenames = ["tid.dat.gz", "tid_pos.dat.gz", "tid_map.dat.gz"];
    const buffers = await Promise.all(
      filenames.map((filename) => config.loadArrayBuffer(filename))
    );
    const token_info_buffer = new Uint8Array(buffers[0]);
    const pos_buffer = new Uint8Array(buffers[1]);
    const target_map_buffer = new Uint8Array(buffers[2]);
    dic.loadTokenInfoDictionaries(
      token_info_buffer,
      pos_buffer,
      target_map_buffer
    );
  }
  async function loadCost() {
    const buffer = await config.loadArrayBuffer("cc.dat.gz");
    const cc_buffer = new Int16Array(buffer);
    dic.loadConnectionCosts(cc_buffer);
  }
  async function loadUnknown() {
    const filenames = [
      "unk.dat.gz",
      "unk_pos.dat.gz",
      "unk_map.dat.gz",
      "unk_char.dat.gz",
      "unk_compat.dat.gz",
      "unk_invoke.dat.gz"
    ];
    const buffers = await Promise.all(
      filenames.map((filename) => config.loadArrayBuffer(filename))
    );
    const unk_buffer = new Uint8Array(buffers[0]);
    const unk_pos_buffer = new Uint8Array(buffers[1]);
    const unk_map_buffer = new Uint8Array(buffers[2]);
    const cat_map_buffer = new Uint8Array(buffers[3]);
    const compat_cat_map_buffer = new Uint32Array(buffers[4]);
    const invoke_def_buffer = new Uint8Array(buffers[5]);
    dic.loadUnknownDictionaries(
      unk_buffer,
      unk_pos_buffer,
      unk_map_buffer,
      cat_map_buffer,
      compat_cat_map_buffer,
      invoke_def_buffer
    );
  }
  await Promise.all([loadTrie(), loadInfo(), loadCost(), loadUnknown()]);
  return dic;
}

// src/TokenizerBuilder.ts
var TokenizerBuilder = class {
  constructor(options) {
    this.options = options;
  }
  async build() {
    const dic = await loadDictionary(this.options.loader);
    return new Tokenizer_default(dic);
  }
};
var TokenizerBuilder_default = TokenizerBuilder;

// src/dict/builder/ConnectionCostsBuilder.ts
var ConnectionCostsBuilder = class {
  lines;
  connection_cost;
  constructor() {
    this.lines = 0;
    this.connection_cost = null;
  }
  putLine(line) {
    if (this.lines === 0) {
      const dimensions = line.split(" ");
      const forward_dimension = Number(dimensions[0]);
      const backward_dimension = Number(dimensions[1]);
      if (forward_dimension < 0 || backward_dimension < 0) {
        throw "Parse error of matrix.def";
      }
      this.connection_cost = new ConnectionCosts_default(
        forward_dimension,
        backward_dimension
      );
      this.lines++;
      return this;
    }
    const costs = line.split(" ");
    if (costs.length !== 3) {
      return this;
    }
    const forward_id = parseInt(costs[0]);
    const backward_id = parseInt(costs[1]);
    const cost = parseInt(costs[2]);
    if (forward_id < 0 || backward_id < 0 || !isFinite(forward_id) || !isFinite(backward_id) || this.connection_cost.forward_dimension <= forward_id || this.connection_cost.backward_dimension <= backward_id) {
      throw "Parse error of matrix.def";
    }
    this.connection_cost.put(forward_id, backward_id, cost);
    this.lines++;
    return this;
  }
  build() {
    return this.connection_cost;
  }
};
var ConnectionCostsBuilder_default = ConnectionCostsBuilder;

// src/dict/builder/CharacterDefinitionBuilder.ts
var CATEGORY_DEF_PATTERN = /^(\w+)\s+(\d)\s+(\d)\s+(\d)/;
var CATEGORY_MAPPING_PATTERN = /^(0x[0-9A-F]{4})(?:\s+([^#\s]+))(?:\s+([^#\s]+))*/;
var RANGE_CATEGORY_MAPPING_PATTERN = /^(0x[0-9A-F]{4})\.\.(0x[0-9A-F]{4})(?:\s+([^#\s]+))(?:\s+([^#\s]+))*/;
var CharacterDefinitionBuilder = class {
  char_def;
  character_category_definition;
  category_mapping;
  constructor() {
    this.char_def = new CharacterDefinition_default();
    this.char_def.invoke_definition_map = new InvokeDefinitionMap_default();
    this.character_category_definition = [];
    this.category_mapping = [];
  }
  putLine(line) {
    const parsed_category_def = CATEGORY_DEF_PATTERN.exec(line);
    if (parsed_category_def != null) {
      const class_id = this.character_category_definition.length;
      const char_class = CharacterDefinition_default.parseCharCategory(
        class_id,
        parsed_category_def
      );
      if (char_class == null) {
        return;
      }
      this.character_category_definition.push(char_class);
      return;
    }
    const parsed_category_mapping = CATEGORY_MAPPING_PATTERN.exec(line);
    if (parsed_category_mapping != null) {
      const mapping = CharacterDefinition_default.parseCategoryMapping(
        parsed_category_mapping
      );
      this.category_mapping.push(mapping);
    }
    const parsed_range_category_mapping = RANGE_CATEGORY_MAPPING_PATTERN.exec(line);
    if (parsed_range_category_mapping != null) {
      const range_mapping = CharacterDefinition_default.parseRangeCategoryMapping(
        parsed_range_category_mapping
      );
      this.category_mapping.push(range_mapping);
    }
  }
  build() {
    this.char_def.invoke_definition_map.init(
      this.character_category_definition
    );
    this.char_def.initCategoryMappings(this.category_mapping);
    return this.char_def;
  }
};
var CharacterDefinitionBuilder_default = CharacterDefinitionBuilder;

// src/dict/builder/DictionaryBuilder.ts
var DictionaryBuilder = class {
  tid_entries;
  unk_entries;
  cc_builder;
  cd_builder;
  constructor() {
    this.tid_entries = [];
    this.unk_entries = [];
    this.cc_builder = new ConnectionCostsBuilder_default();
    this.cd_builder = new CharacterDefinitionBuilder_default();
  }
  addTokenInfoDictionary(line) {
    const new_entry = line.split(",");
    this.tid_entries.push(new_entry);
    return this;
  }
  putCostMatrixLine(line) {
    this.cc_builder.putLine(line);
    return this;
  }
  putCharDefLine(line) {
    this.cd_builder.putLine(line);
    return this;
  }
  putUnkDefLine(line) {
    this.unk_entries.push(line.split(","));
    return this;
  }
  build() {
    const dictionaries = this.buildTokenInfoDictionary();
    const unknown_dictionary = this.buildUnknownDictionary();
    return new DynamicDictionaries_default(
      dictionaries.trie,
      dictionaries.token_info_dictionary,
      this.cc_builder.build() ?? void 0,
      unknown_dictionary
    );
  }
  buildTokenInfoDictionary() {
    const token_info_dictionary = new TokenInfoDictionary_default();
    const dictionary_entries = token_info_dictionary.buildDictionary(
      this.tid_entries
    );
    const trie = this.buildDoubleArray();
    for (const token_info_id in dictionary_entries) {
      const surface_form = dictionary_entries[token_info_id];
      const trie_id = trie.lookup(surface_form);
      token_info_dictionary.addMapping(
        trie_id,
        // @ts-expect-error Argument of type 'string' is not assignable to parameter of type 'number'
        token_info_id
      );
    }
    return {
      trie,
      token_info_dictionary
    };
  }
  buildUnknownDictionary() {
    const unk_dictionary = new UnknownDictionary_default();
    const dictionary_entries = unk_dictionary.buildDictionary(this.unk_entries);
    const char_def = this.cd_builder.build();
    unk_dictionary.characterDefinition(char_def);
    for (const token_info_id in dictionary_entries) {
      const class_name = dictionary_entries[token_info_id];
      const class_id = char_def.invoke_definition_map.lookup(class_name);
      unk_dictionary.addMapping(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        class_id,
        // @ts-expect-error Argument of type 'string' is not assignable to parameter of type 'number'.ts(2345)
        token_info_id
      );
    }
    return unk_dictionary;
  }
  buildDoubleArray() {
    let trie_id = 0;
    const words = this.tid_entries.map(function(entry) {
      const surface_form = entry[0];
      return { k: surface_form, v: trie_id++ };
    });
    const builder3 = builder(1024 * 1024);
    return builder3.build(words);
  }
};
var DictionaryBuilder_default = DictionaryBuilder;

// src/kuromoji.ts
function builder2(options) {
  return new TokenizerBuilder_default(options);
}
function dictionaryBuilder() {
  return new DictionaryBuilder_default();
}
export {
  DictionaryBuilder_default as DictionaryBuilder,
  TokenizerBuilder_default as TokenizerBuilder,
  builder2 as builder,
  dictionaryBuilder
};
