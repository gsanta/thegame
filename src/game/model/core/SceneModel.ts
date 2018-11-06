import { Scene } from 'babylonjs';

export class Rectangle {
    left: number;
    bottom: number;
    width: number;
    height: number;

    constructor(left: number, bottom: number, width: number, height: number) {
        this.left = left;
        this.bottom = bottom;
        this.width = width;
        this.height = height;
    }
}

export class SceneModel {
    private scene: Scene;
    private dimensions: Rectangle;

    constructor(scene: Scene, dimensions: Rectangle) {
        this.scene = scene;
        this.dimensions = dimensions;
    }

    public getWidth() {
        return this.dimensions.width;
    }

    public getMinX() {
        return this.dimensions.left;
    }

    public getDepth() {
        return this.dimensions.height;
    }

    public getMinZ() {
        return this.dimensions.bottom;
    }
}