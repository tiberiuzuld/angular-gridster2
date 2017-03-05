import { Gridster2Page } from './app.po';

describe('gridster2 App', () => {
  let page: Gridster2Page;

  beforeEach(() => {
    page = new Gridster2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
