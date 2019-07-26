import { FollowCamera, Light, Scene, SpotLight, StandardMaterial, Engine } from '@babylonjs/core';
import { Vector2Model } from '../model/utils/Vector2Model';
import { Tool } from '../tools/Tool';
import { WorldFactory } from './world_factory/WorldFactory';
import { GameObject } from './world_items/item_types/GameObject';

export interface WorldConfig {
    displayBoundingBoxes: boolean;
}

export class World {
    public canvas: HTMLCanvasElement;
    public engine: Engine;
    public hemisphericLight: Light;
    public dimensions: Vector2Model;
    public worldItems: GameObject[];
    public floor: GameObject;
    public enemies: GameObject[] = [];
    public player: GameObject = null;
    public rooms: GameObject[];

    public camera: FollowCamera;

    public tools: Tool[];

    public materials: {[key: string]: StandardMaterial};
    public scene: Scene;

    public getWorldItemsByName(name: string): GameObject[] {
        return this.worldItems.filter(gameObject => gameObject.type === name);
    }

    public factory: WorldFactory;

    public config: WorldConfig = {
        displayBoundingBoxes: false
    };
}
