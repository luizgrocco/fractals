// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

import { UnlimitedString } from "./unlimited-string";

// An LSystem has a starting sentence
// An a ruleset
// Each generation recursively replaces characters in the sentence
// Based on the ruleset

// Construct an LSystem with a starting sentence and a ruleset
export type Axiom = string;
export type Rules = {
  [key: string]: string;
};

export class LSystem {
  axiom: Axiom;
  sentence: UnlimitedString;
  ruleset: Rules;

  constructor(axiom: Axiom, rules: Rules) {
    this.axiom = axiom;
    this.sentence = new UnlimitedString(axiom); // The sentence (a String)
    this.ruleset = rules; // The ruleset (an array of Rule objects)

    Object.keys(this.ruleset).forEach((key) => {
      this.ruleset[key] = this.ruleset[key].replace(/\s/g, "");
    });
  }

  reset() {
    this.sentence = new UnlimitedString(this.axiom);
  }

  // Generate the next generation
  generate() {
    // An empty string that we will fill
    const nextgen = new UnlimitedString();

    // For every character in the sentence
    for (const char of this.sentence) {
      // Replace it with itself unless it matches one of our rules
      nextgen.append(this.ruleset[char] ?? char);
    }

    // Replace sentence
    this.sentence = nextgen;
    return nextgen;
  }
}
