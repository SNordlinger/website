class CharacterAnimation {
  constructor(endChar) {
    this.endChar = endChar;
    this.currentFrame = 0;
    this.totalFrames = Math.floor(Math.random() * (200 - 10)) + 10;
  }

  getFrame() {
    this.currentFrame++;
    if (this.currentFrame >= this.totalFrames) {
      return this.endChar;
    }

    return getRandomLetter();
  }

  isDone() {
    return this.currentFrame >= this.totalFrames;
  }
}

function getRandomLetter() {
  const charCode = Math.floor(Math.random() * (126 - 33)) + 33;
  return String.fromCharCode(charCode);
}

export default CharacterAnimation;
