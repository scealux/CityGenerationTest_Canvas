export class Vector {
  static create(x = 0, y = 0) {
    return { x, y };
  }
}

export class Spring {
  constructor(anchor, k, restLength, bob) {
    this.anchor = anchor;
    this.k = k;
    this.restLength = restLength;
    this.bob = bob;
    this.aceleration = 0;
    this.velocity = 0;
  }

  move() {
    //update position of bob
  }

  attachAnchor(anch) {
    this.anchor = anch;
  }

  attachBob(bober) {
    this.bob = bober;
  }

  tester() {
    console.log("That worked");
  }
}
