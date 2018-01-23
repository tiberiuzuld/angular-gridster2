import { GridsterCompact } from '../gridsterCompact.service';

describe('gridsterCompact service', () => {
    let compactType = 'none';
    let collision: boolean;

    class MockGridsterComponent {

        $options: any = this.getCompactType();
        grid: any = [{$item: {compactEnabled: false}}, {$item: {compactEnabled: true}}];

        getCompactType() {
            switch (compactType) {
                case 'compactUp':
                    return {compactType: 'compactUp'};
                case 'compactLeft':
                    return {compactType: 'compactLeft'};
                case 'compactUp&Left':
                    return {compactType: 'compactUp&Left'};
                case 'compactLeft&Up':
                    return {compactType: 'compactLeft&Up'};
                default:
                    return {compactType: 'none'};
            }
        }

        checkCollision($item: any): any {
            if ($item.y < 0 || $item.x < 0) {
                return true;
            } else {
                return false;
            }
        }
    }
    let gridsterCompact: any;
    let spy: any;
    let spy2: any;

    it('should check if checkCompactUp called', () => {
        compactType = 'compactUp';
        const gridster: any = new MockGridsterComponent();
        gridsterCompact = new GridsterCompact(gridster);

        spy = spyOn(gridsterCompact, 'checkCompactUp');
        gridsterCompact.checkCompact();
        expect(gridsterCompact.checkCompactUp).toHaveBeenCalled();
    });

    it('should check if checkCompactleft called', () => {
        compactType = 'compactLeft';
        const gridster: any = new MockGridsterComponent();
        gridsterCompact = new GridsterCompact(gridster);

        spy = spyOn(gridsterCompact, 'checkCompactLeft');
        gridsterCompact.checkCompact();
        expect(gridsterCompact.checkCompactLeft).toHaveBeenCalled();
    });

    it('should check if checkCompactUp & checkCompactLeft called', () => {
        compactType = 'compactUp&Left';
        const gridster: any = new MockGridsterComponent();
        gridsterCompact = new GridsterCompact(gridster);

        spy2 = spyOn(gridsterCompact, 'checkCompactUp');
        spy = spyOn(gridsterCompact, 'checkCompactLeft');
        gridsterCompact.checkCompact();
        expect(gridsterCompact.checkCompactUp).toHaveBeenCalled();
        expect(gridsterCompact.checkCompactLeft).toHaveBeenCalled();
    });

    it('should check if checkCompactLeft & checkCompactUp called', () => {
        compactType = 'compactLeft&Up';
        const gridster: any = new MockGridsterComponent();
        gridsterCompact = new GridsterCompact(gridster);
        spy = spyOn(gridsterCompact, 'checkCompactLeft');
        spy2 = spyOn(gridsterCompact, 'checkCompactUp');

        gridsterCompact.checkCompact();
        expect(gridsterCompact.checkCompactLeft).toHaveBeenCalled();
        expect(gridsterCompact.checkCompactUp).toHaveBeenCalled();
    });

    it('should check moveUpTillCollision when checkCollision returns true', () => {
        collision = true;
        const itemComponent = {$item: {y : 0, x: 0} };
        const gridster: any = new MockGridsterComponent();
        gridsterCompact = new GridsterCompact(gridster);
        expect(gridsterCompact.moveUpTillCollision(itemComponent)).toBe(false);
    });

    it('should check moveLeftTillCollision when checkCollision returns true', () => {
        collision = true;
        const itemComponent = {$item: {y : 0, x: 0} };
        const gridster: any = new MockGridsterComponent();
        gridsterCompact = new GridsterCompact(gridster);
        expect(gridsterCompact.moveLeftTillCollision(itemComponent)).toBe(false);
    });

    it('should check if moveUpTillCollision called when compactType is compactUp', () => {
        compactType = 'compactUp';
        spy = spyOn(gridsterCompact, 'moveUpTillCollision');
        gridsterCompact.checkCompactUp();
        expect(gridsterCompact.moveUpTillCollision).toHaveBeenCalled();
    });

    it('should check if moveLeftTillCollision called when compactType is compactLeft', () => {
        compactType = 'compactLeft';
        spy = spyOn(gridsterCompact, 'moveLeftTillCollision');
        gridsterCompact.checkCompactLeft();
        expect(gridsterCompact.moveLeftTillCollision).toHaveBeenCalled();
    });
});
