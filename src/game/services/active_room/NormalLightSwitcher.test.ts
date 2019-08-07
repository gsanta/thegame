import { Light, Mesh } from '@babylonjs/core';
import { GameObject } from '../../model/game_objects/GameObject';
import { NormalLightSwitcher } from './NormalLightSwitcher';
import { expect } from 'chai';
import { World } from '../../model/game_objects/World';
import { Room } from '../../model/game_objects/Room';
import { Border } from '../../model/game_objects/Border';
declare const describe, beforeEach, afterEach, it;

const createWorldMock = (excludedMeshes: Mesh[]): World => {

    const lightMock: Partial<Light> = {
        excludedMeshes: excludedMeshes
    };

    return <World> {
        hemisphericLight: <any> lightMock
    };
};

const createRoomMock = (roomMesh: Partial<Mesh>, childMeshes: Partial<Mesh>[], neighbourMeshes: Partial<Mesh>[]): Room => {

    const children = childMeshes.map(mesh => {
        return <Partial<GameObject>> {
            mesh
        };
    });

    const neighbours = neighbourMeshes.map(mesh => {
        return <Partial<Border>> {
            mesh
        };
    });


    return <Room> {
        meshes: <any> [roomMesh],
        children: children,
        borders: neighbours
    };
};

describe('`LightSwitcher`', () => {
    describe(`on`, () => {
        it ('removes the mesh from the `excludedMeshes` array', () => {
            const wallMesh: Partial<Mesh> = {
                name: 'wall'
            };

            const tableMesh: Partial<Mesh> = {
                name: 'table'
            };

            const roomMesh: Partial<Mesh> = {
                name: 'room'
            };

            const world = createWorldMock([<Mesh> roomMesh, <Mesh> wallMesh, <Mesh> tableMesh]);
            const room = createRoomMock(roomMesh, [wallMesh], [tableMesh]);

            const lightHandler = new NormalLightSwitcher();

            expect(world.hemisphericLight.excludedMeshes.length).to.eq(3);
            return lightHandler.on(room, world)
                .then(() => {
                    expect(world.hemisphericLight.excludedMeshes.length).to.eq(0);
                });
        });
    });

    describe(`off`, () => {
        it ('adds the mesh to the `excludedMeshes` array', () => {
            const wallMesh: Partial<Mesh> = {
                name: 'wall'
            };

            const tableMesh: Partial<Mesh> = {
                name: 'table'
            };

            const roomMesh: Partial<Mesh> = {
                name: 'room'
            };

            const world = createWorldMock([]);
            const room = createRoomMock(roomMesh, [wallMesh], [tableMesh]);

            const lightHandler = new NormalLightSwitcher();

            expect(world.hemisphericLight.excludedMeshes.length).to.eq(0);
            lightHandler.off(room, world);
            expect(world.hemisphericLight.excludedMeshes).to.eql([<Mesh> roomMesh, <Mesh> wallMesh, <Mesh> tableMesh]);
        });
    });
});
