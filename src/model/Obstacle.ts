import { Mesh, Scene, MeshBuilder, Vector3 } from 'babylonjs';
import * as BABYLON from 'babylonjs';


export class Obstacle {
    private mesh: Mesh;

    constructor(mesh: Mesh) {
        this.mesh = mesh;
    }

    public static createBox(id: number, scene: Scene, translate: Vector3, dimensions: Vector3) {
        var blueMat = new BABYLON.StandardMaterial("blueMat", scene);
        blueMat.emissiveColor = new BABYLON.Color3(0, 0, 1);
        const mesh = MeshBuilder.CreateBox(
            "obstalce-" + id,
            { width: dimensions.x, depth: dimensions.z, height: dimensions.y },
            scene
        );

        mesh.material = blueMat;
        mesh.translate(translate, 1);
        mesh.checkCollisions = true;

        return new Obstacle(mesh);
    }

    public static createBox2(id: number, scene: Scene, translate: Vector3, dimensions: Vector3) {
        var blueMat = new BABYLON.StandardMaterial("blueMat", scene);
        blueMat.emissiveColor = new BABYLON.Color3(0, 0, 1);
        const mesh = MeshBuilder.CreateBox(
            "obstalce-" + id,
            { width: dimensions.x, depth: dimensions.z, height: dimensions.y },
            scene
        );

        mesh.material = blueMat;
        mesh.translate(translate, 1);
        mesh.rotate(BABYLON.Axis.Y, 0.2);
        mesh.checkCollisions = true;

        return new Obstacle(mesh);
    }

    public static createLine(id: number, scene: Scene, coord1: Vector3, coord2: Vector3) {
        var blueMat = new BABYLON.StandardMaterial("blueMat", scene);
        blueMat.emissiveColor = new BABYLON.Color3(0, 0, 1);

        const mesh = MeshBuilder.CreateLines(
            "obstalce-" + id,
            { points: [coord1, coord2]},
            scene
        );

        mesh.material = blueMat;
        // mesh.checkCollisions = true;
        return new Obstacle(mesh);
    }

    public getBody(): Mesh {
        return this.mesh;
    }
}