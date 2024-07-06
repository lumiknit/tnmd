type Cursor = {
	p: number;
	line: number;
	col: number;
};

/**
 * Parsing helper for the data type
 */
export class Parser {
	src: string;
	cursor: Cursor;
	lastPos?: Cursor;
	stack: Cursor[] = [];

	constructor(src: string) {
		this.src = src;
		this.cursor = {
			p: 0,
			line: 0,
			col: 0,
		};
		this.stack = [];
	}

	raiseError(msg: string): never {
		const line = this.src.split("\n")[this.cursor.line];
		const lineNo = this.cursor.line + 1;
		const colNo = this.cursor.col + 1;
		throw new Error(`${lineNo}:${colNo}: ${msg}\n${line}`);
	}

	/**
	 * Return true if the cursor is at the end of the file
	 */
	isEOF() {
		return this.cursor.p >= this.src.length;
	}

	/** Skip n characters */
	skip(n: number) {
		for (let i = 0; i < n; i++) {
			if (this.src[this.cursor.p] === "\n") {
				this.cursor.line++;
				this.cursor.col = 0;
			} else {
				this.cursor.col++;
			}
			this.cursor.p++;
		}
	}

	/** Peek */
	peek(n: number = 1) {
		return this.src.slice(this.cursor.p, this.cursor.p + n);
	}

	/** Save current cursor */
	save() {
		this.stack.push({ ...this.cursor });
	}

	/** Restore cursor */
	restore() {
		this.cursor = this.stack.pop()!;
	}

	/** Discard the pushed state */
	fin(): string {
		const cur = this.stack.pop();
		return cur ? this.src.slice(cur.p, this.cursor.p) : "";
	}

	/** Check progress.
	 * This is useful to prevent infinite loop.
	 */
	checkProgress() {
		if (this.lastPos && this.lastPos.p === this.cursor.p) {
			this.raiseError("No progress, maybe infinite loop");
		}
		this.lastPos = { ...this.cursor };
	}

	/**
	 * Match and consume.
	 * If the pattern is RegExp, it should be with y flag.
	 */
	eat(pat: RegExp): string | void {
		pat.lastIndex = this.cursor.p;
		const match = pat.exec(this.src);
		if (match) {
			this.skip(match[0].length);
			return match[0];
		}
	}

	/**
	 * Match and consume until the pattern is found.
	 * This return the string BEFORE the pattern.
	 * If the pattern is RegExp, it should be with g flag.
	 */
	eatUntil(pat: RegExp): string | void {
		pat.lastIndex = this.cursor.p;
		const match = pat.exec(this.src);
		if (match) {
			const str = this.src.slice(this.cursor.p, match.index);
			this.skip(match.index - this.cursor.p);
			return str;
		} else {
			// Skip all
			const str = this.src.slice(this.cursor.p);
			this.skip(str.length);
			return str;
		}
	}

	/**
	 * Match and consume until the pattern is found.
	 */
	equal(str: string) {
		return this.src.slice(this.cursor.p, this.cursor.p + str.length) === str;
	}

	eatString(str: string): boolean {
		if (!this.equal(str)) return false;
		this.skip(str.length);
		return true;
	}

	// Helpers

	skipWhitespace() {
		this.eat(/\s+/y);
	}

	skipUntilNewline() {
		this.eatUntil(/\n|$/g);
	}
}
