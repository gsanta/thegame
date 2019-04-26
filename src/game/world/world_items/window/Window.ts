import { SerializedMeshModel, WorldItem } from '../WorldItem';
import { StandardMaterial, Scene, MeshBuilder, Mesh } from 'babylonjs';
import { VectorModel } from '../../../model/core/VectorModel';
import _ = require('lodash');
import { MeshTemplateConfig } from '../../../model/core/templates/MeshTemplate';
import { SimpleWorldItem } from '../SimpleWorldItem';
import { ContainerWorldItem } from '../ContainerWorldItem';
import { GameConstants } from '../../../GameConstants';
import { GwmWorldItem, Rectangle } from 'game-worldmap-generator';
import { World } from '../../World';
import { Point } from 'game-worldmap-generator/build/model/Point';
import { Border } from '../Border';
const colors = GameConstants.colors;

export class WindowGlass extends ContainerWorldItem {

    public constructor(containerMesh: Mesh, children: WorldItem[]) {
        super(children);
        this.containerMesh = containerMesh;
    }

    public setPivotMatrix(matrix: any) {
        this.children[0].mesh.setPivotMatrix(matrix);
        this.children[1].mesh.setPivotMatrix(matrix);
    }

    public static fromGwmWorldItem(gwmWorldItem: GwmWorldItem, scene: Scene, world: World): WindowGlass {
        const containerMesh = this.createContainerMesh(gwmWorldItem, scene);
        const side1 = this.createMesh(gwmWorldItem, scene);
        const side2 = this.createMesh(gwmWorldItem, scene);
        side1.mesh.parent = containerMesh;
        side2.mesh.parent = containerMesh;
        side1.translate(new VectorModel(0, 0, gwmWorldItem.dimensions.height / 16));
        side2.translate(new VectorModel(0, 0, -gwmWorldItem.dimensions.height / 16));

        return new WindowGlass(containerMesh, [side1, side2]);
    }

    private static createMesh(gwmWorldItem: GwmWorldItem, scene: Scene): SimpleWorldItem {
        const dimensions = gwmWorldItem.dimensions;
        const middle1 = MeshBuilder.CreateBox(
            'window-middle-left',
            { width: dimensions.width / 2, depth: dimensions.height / 8, height: 4 * 5 / 6 },
            scene
        );

        middle1.material = this.createMaterial(scene);
        middle1.receiveShadows = true;

        return new SimpleWorldItem(middle1, '');
    }

    private static createMaterial(scene: Scene): StandardMaterial {
        const windowGlass = new BABYLON.StandardMaterial('window-glass-material', scene);
        windowGlass.diffuseColor = BABYLON.Color3.FromHexString(colors.window);

        return windowGlass;
    }

    private static createContainerMesh(gwmWorldItem: GwmWorldItem, scene: Scene) {
        const dimensions = gwmWorldItem.dimensions;

        const mesh = MeshBuilder.CreateBox(
            'window-glass-left-container',
            { width: dimensions.width / 2, depth: dimensions.height / 4, height: 4 * 5 / 6 },
            scene
        );

        mesh.isVisible = false;

        return mesh;
    }
}

class WindowFrame extends ContainerWorldItem {
    public constructor(containerMesh: Mesh, children: WorldItem[]) {
        super(children);
        this.containerMesh = containerMesh;    }

    public static fromGwmWorldItem(gwmWorldItem: GwmWorldItem, scene: Scene, world: World): WindowFrame {
        const containerMesh = this.createContainerMesh(gwmWorldItem, scene);
        const side1 = this.createMesh(gwmWorldItem, scene);
        const side2 = this.createMesh(gwmWorldItem, scene);
        side1.mesh.parent = containerMesh;
        side2.mesh.parent = containerMesh;
        side1.translate(new VectorModel(0, 0, gwmWorldItem.dimensions.height / 16));
        side2.translate(new VectorModel(0, 0, -gwmWorldItem.dimensions.height / 16));

        return new WindowGlass(containerMesh, [side1, side2]);    }

    private static createMesh(gwmWorldItem: GwmWorldItem, scene: Scene): SimpleWorldItem {
        const dimensions = gwmWorldItem.dimensions;

        const mesh = MeshBuilder.CreateBox(
            'window-bottom',
            { width: dimensions.width, depth: dimensions.height / 8, height: 5 / 6 },
            scene
        );

        mesh.material = this.createMaterial(scene);
        mesh.receiveShadows = true;

        return new SimpleWorldItem(mesh, '');
    }

    private static createMaterial(scene: Scene): StandardMaterial {
        const windowFrame = new BABYLON.StandardMaterial('window-frame-material', scene);
        windowFrame.diffuseColor = BABYLON.Color3.FromHexString(colors.wall);
        windowFrame.emissiveColor = BABYLON.Color3.FromHexString('#111111');

        return windowFrame;
    }

    private static createContainerMesh(gwmWorldItem: GwmWorldItem, scene: Scene) {
        const dimensions = gwmWorldItem.dimensions;

        const mesh = MeshBuilder.CreateBox(
            'window-glass-left-container',
            { width: dimensions.width, depth: dimensions.height / 4, height: 5 / 6 },
            scene
        );

        mesh.isVisible = false;

        return mesh;
    }
}

export class Window extends ContainerWorldItem implements Border {
    public isOpen: boolean;
    private pivotAngle: number;
    private isHorizontal = true;
    public sides: [ContainerWorldItem, ContainerWorldItem];

    private pivot1: VectorModel;
    private pivot2: VectorModel;

    constructor(containerMesh: Mesh, children: WorldItem[], config?: MeshTemplateConfig) {
        super(children);
        this.containerMesh = containerMesh;

        children.forEach(child => child.setParent(this));
        this.hasDefaultAction = true;

        this.sides = [
            new ContainerWorldItem(
                [
                    (<ContainerWorldItem> this.children[0]).children[0],
                    (<ContainerWorldItem> this.children[1]).children[0],
                    (<ContainerWorldItem> this.children[2]).children[0],
                    (<ContainerWorldItem> this.children[3]).children[0]
                ]
            ),
            new ContainerWorldItem(
                [
                    (<ContainerWorldItem> this.children[0]).children[1],
                    (<ContainerWorldItem> this.children[1]).children[1],
                    (<ContainerWorldItem> this.children[2]).children[1],
                    (<ContainerWorldItem> this.children[3]).children[1]
                ]
            )
        ];
    }

    public setPivots(pivot1: VectorModel, pivot2: VectorModel, pivotAngle: number) {
        this.pivotAngle = pivotAngle;
        this.pivot1 = pivot1;
        this.pivot2 = pivot2;

        // (<WindowGlass> this.children[2]).setPivotMatrix(BABYLON.Matrix.Translation(pivot1.x, pivot1.y, pivot1.z));
        // (<WindowGlass> this.children[3]).setPivotMatrix(BABYLON.Matrix.Translation(pivot2.x, pivot2.y, pivot2.z));
    }

    public doDefaultAction() {
        if (this.isOpen) {
            if (this.isHorizontal) {
                (<ContainerWorldItem> this.children[2]).children[0].mesh.rotation.y = 0;
                (<ContainerWorldItem> this.children[3]).children[0].mesh.rotation.y = 0;
            } else {
                (<ContainerWorldItem> this.children[2]).children[0].mesh.rotation.y = 0;
                (<ContainerWorldItem> this.children[3]).children[0].mesh.rotation.y = 0;
            }
            this.isOpen = false;
        } else {
            (<ContainerWorldItem> this.children[2]).children[0].mesh.rotation.y = this.pivotAngle;
            (<ContainerWorldItem> this.children[3]).children[0].mesh.rotation.y = - this.pivotAngle;
            this.isOpen = true;
        }
    }

    public getPosition(): VectorModel {
        const position = this.containerMesh.getAbsolutePosition();
        return new VectorModel(position.x, position.y, position.z);
    }

    public intersectsPoint(vector: VectorModel) {
        return this.intersectsPoint(new VectorModel(vector.x, vector.y, vector.z));
    }

    public serialize(): SerializedMeshModel {
        const baseInfo = super.serialize();

        baseInfo.additionalData = {
            angle: this.pivotAngle,
            axis1: this.pivot1.serialize(),
            axis2: this.pivot2.serialize()
        };

        return baseInfo;
    }

    public clone(): Window {
        return null;
    }

    public getSide1BoundingPolygon() {
        const mesh: any = (<ContainerWorldItem> this.children[2]).children[0].mesh;
        const width = mesh.geometry.extend.maximum.x - mesh.geometry.extend.minimum.x;
        const height = mesh.geometry.extend.maximum.z - mesh.geometry.extend.minimum.z;
        const position = mesh.getAbsolutePosition();
        const centerPoint = new Point(position.x, position.z);

        return new Rectangle(centerPoint.x - width / 2, centerPoint.y - height / 2, width, height);
    }

    public getSide2BoundingPolygon() {
        const mesh: any = (<ContainerWorldItem> this.children[2]).children[1].mesh;
        const width = mesh.geometry.extend.maximum.x - mesh.geometry.extend.minimum.x;
        const height = mesh.geometry.extend.maximum.z - mesh.geometry.extend.minimum.z;
        const position = mesh.getAbsolutePosition();
        const centerPoint = new Point(position.x, position.z);

        return new Rectangle(centerPoint.x - width / 2, centerPoint.y - height / 2, width, height);
    }

    public getSide1Meshes(): Mesh[] {
        return [
            (<ContainerWorldItem> this.children[0]).children[0].mesh,
            (<ContainerWorldItem> this.children[1]).children[0].mesh,
            (<ContainerWorldItem> this.children[2]).children[0].mesh,
            (<ContainerWorldItem> this.children[3]).children[0].mesh
        ];
    }

    public getSide2Meshes(): Mesh[] {
        return [
            (<ContainerWorldItem> this.children[0]).children[1].mesh,
            (<ContainerWorldItem> this.children[1]).children[1].mesh,
            (<ContainerWorldItem> this.children[2]).children[1].mesh,
            (<ContainerWorldItem> this.children[3]).children[1].mesh
        ];
    }

    public static fromGwmWorldItem(gwmWorldItem: GwmWorldItem, scene: Scene, world: World): Window {
        const translateX = - (world.dimensions.x() / 2);
        const translateY = - (world.dimensions.y() / 2);

        gwmWorldItem.dimensions = gwmWorldItem.dimensions
            .translate(new Point(translateX, translateY));


        const topFrame = WindowFrame.fromGwmWorldItem(gwmWorldItem, scene, world);
        const bottomFrame = WindowFrame.fromGwmWorldItem(gwmWorldItem, scene, world);
        const leftGlass = WindowGlass.fromGwmWorldItem(gwmWorldItem, scene, world);
        const rightGlass = WindowGlass.fromGwmWorldItem(gwmWorldItem, scene, world);

        const height = 5;

        bottomFrame.translate(new VectorModel(0, - height / 2 + height / 12, 0));
        topFrame.translate(new VectorModel(0, height / 2 - height / 12, 0));
        leftGlass.translate(new VectorModel(- gwmWorldItem.dimensions.width / 4, 0, 0));
        rightGlass.translate(new VectorModel(gwmWorldItem.dimensions.width / 4, 0, 0));

        const containerMesh = this.createContainerMesh(scene);

        const window = new Window(containerMesh, [ topFrame, bottomFrame, leftGlass, rightGlass ]);
        window.translate(new VectorModel(gwmWorldItem.dimensions.getBoundingCenter().x, 2.5, -gwmWorldItem.dimensions.getBoundingCenter().y));

        return window;
    }

    private static createContainerMesh(scene: Scene): Mesh {
        const width = 8;
        const depth = 1;
        const height = 5;

        const containerMesh = MeshBuilder.CreateBox(
            'window-container',
            { width, depth, height: height / 4 },
            scene
        );

        containerMesh.isVisible = false;

        return containerMesh;
    }
}