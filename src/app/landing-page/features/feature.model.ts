export class Feature {
  title: string;
  imageStr: string;

  constructor(title: string, image: string, public link: string) {
    this.title = title;
    this.imageStr = image;
  }
}
