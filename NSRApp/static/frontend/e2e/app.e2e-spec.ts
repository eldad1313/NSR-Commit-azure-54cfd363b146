import { MaytronicsPage } from './app.po';

describe('maytronics App', function() {
  let page: MaytronicsPage;

  beforeEach(() => {
    page = new MaytronicsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
