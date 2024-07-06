import { expect, test } from "vitest";
import { escapeString, unescapeString } from "./helper";

test("esc1", () => {
	expect(escapeString("abc")).toBe("abc");
	expect(escapeString("a\tb")).toBe("a\\tb");
	expect(escapeString("a\nb")).toBe("a\\nb");
	expect(escapeString("a\\b")).toBe("a\\\\b");
	expect(escapeString('a"b')).toBe('a\\"b');
	expect(escapeString("a'b")).toBe("a\\'b");
	expect(escapeString("a`b")).toBe("a`b");
	expect(escapeString("a\x00b")).toBe("a\\x00b");
	expect(escapeString("a\x7fb")).toBe("a\\eb");
});

test("esc2", () => {
	expect(escapeString("Hello, world!\n")).toBe("Hello, world!\\n");
	expect(escapeString("This\r\n is a kind \t")).toBe(
		"This\\r\\n is a kind \\t",
	);
	expect(escapeString("다람쥐, 헌 쳇바퀴 타고파")).toBe(
		"다람쥐, 헌 쳇바퀴 타고파",
	);
});

test("unesc1", () => {
	expect(unescapeString("abc")).toBe("abc");
	expect(unescapeString("a\\tb")).toBe("a\tb");
	expect(unescapeString("a\\nb")).toBe("a\nb");
	expect(unescapeString("a\\\\b")).toBe("a\\b");
	expect(unescapeString('a\\"b')).toBe('a"b');
	expect(unescapeString("a\\'b")).toBe("a'b");
	expect(unescapeString("a`b")).toBe("a`b");
	expect(unescapeString("a\\x00b")).toBe("a\x00b");
	expect(unescapeString("a\\eb")).toBe("a\x7fb");
});

test("unesc2", () => {
	expect(unescapeString("Hello, world!\\n")).toBe("Hello, world!\n");
	expect(unescapeString("This\\r\\n is a kind \\t")).toBe(
		"This\r\n is a kind \t",
	);
	expect(unescapeString("다람쥐, 헌 쳇바퀴 타고파")).toBe(
		"다람쥐, 헌 쳇바퀴 타고파",
	);
});

const escUnescEsc = (s: string) => {
	const esc = escapeString(s);
	const unesc = unescapeString(esc);
	const esc2 = escapeString(unesc);
	expect(unesc).toBe(s);
	expect(esc2).toBe(esc);
};

test("escUnesc", () => {
	escUnescEsc("Hel,,lo, world!\n");
	escUnescEsc("This\r\n is a kind \t");
	escUnescEsc('This\r\n is " test \\\\\\wow\x7a kind \t');
	escUnescEsc("다람쥐, 헌 쳇바퀴 타고파");
});
