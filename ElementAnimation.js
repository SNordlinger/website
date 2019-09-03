import CharacterAnimation from "./CharacterAnimation";

class ElementAnimation {
  constructor(element, extra) {
    this.allComplete = false;
    this.element = element;
    const finalChars = this.element.textContent.split("");
    const charAnimations = finalChars.map(chr => new CharacterAnimation(chr));
    for (let i = 0; i < extra; i++) {
      charAnimations.push(new CharacterAnimation(""));
    }
    this.animations = charAnimations;
  }

  displayNextFrame() {
    if (!this.allComplete) {
      const newChars = this.animations.map(animation => animation.getFrame());
      this.element.textContent = newChars.join("");

      if (this.animations.every(a => a.isDone())) {
        this.allComplete = true;
      }
    }

    return this.element;
  }

  getTag() {
    this.displayNextFrame();
    return this.element;
  }

  isDone() {
    return this.allComplete;
  }
}

export default ElementAnimation;
