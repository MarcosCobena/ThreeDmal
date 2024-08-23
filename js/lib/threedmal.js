/*
 * ThreeDmal
 *
 * Based on WaveJS
 * Copyright (c) 2012 Plain Concepts (http://www.plainconcepts.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 */
"use strict";
var ThreeDmal = {

    /**
     * Creates an instance of a 4x4 matrix filled with zeros.
     * 
     * The matrix is stored as a 1D array in column-major order:
     *    0  1  2  3
     *    4  5  6  7
     *    8  9 10 11
     *   12 13 14 15
     * @constructor
     * @return {ThreeDmal.Matrix4x4}
     */
    Matrix4x4:function () {
        this[0] = 0;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
        this[4] = 0;
        this[5] = 0;
        this[6] = 0;
        this[7] = 0;
        this[8] = 0;
        this[9] = 0;
        this[10] = 0;
        this[11] = 0;
        this[12] = 0;
        this[13] = 0;
        this[14] = 0;
        this[15] = 0;

        return this;
    },

    /**
     * @constructor
     * @param {Number} x
     * @param {Number} y
     * @return {ThreeDmal.Vector2}
     */
    Vector2:function (x, y) {
        this.x = x;
        this.y = y;

        return this;
    },

    /**
     * @constructor
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @return {ThreeDmal.Vector3}
     */
    Vector3:function (x, y, z) {
        var that = this;
        this.x = x;
        this.y = y;
        this.z = z;

        this.normalize = function () {
            var num = Math.sqrt(ThreeDmal.dotProductVector3(that, that));
            that.x /= num;
            that.y /= num;
            that.z /= num;
        };
    },

    /**
     * @constructor
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @param {Number} w
     * @return {ThreeDmal.Vector4}
     */
    Vector4:function (x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        return this;
    },

    /**
     * @param {ThreeDmal.Vector3} position
     * @param {ThreeDmal.Vector3} target
     * @param {ThreeDmal.Vector3} up
     * @return {ThreeDmal.Matrix4x4}
     */
    createLookAtMatrix:function (position, target, up) {
        var targetPosition = ThreeDmal.substractVector3(position, target);
        targetPosition.normalize();
        var upTargetPositionCrossProduct = ThreeDmal.crossProductVector3(up, targetPosition);
        upTargetPositionCrossProduct.normalize();
        var actualUp = ThreeDmal.crossProductVector3(targetPosition, upTargetPositionCrossProduct);
        var result = new ThreeDmal.Matrix4x4();
        result[0] = upTargetPositionCrossProduct.x;
        result[1] = actualUp.x;
        result[2] = targetPosition.x;
        result[4] = upTargetPositionCrossProduct.y;
        result[5] = actualUp.y;
        result[6] = targetPosition.y;
        result[8] = upTargetPositionCrossProduct.z;
        result[9] = actualUp.z;
        result[10] = targetPosition.z;
        result[12] = -ThreeDmal.dotProductVector3(upTargetPositionCrossProduct, position);
        result[13] = -ThreeDmal.dotProductVector3(actualUp, position);
        result[14] = -ThreeDmal.dotProductVector3(targetPosition, position);
        result[15] = 1;

        return result;
    },

    /**
     * Creates a perspective field-of-view matrix
     * @param {Number} fieldOfView
     * @param {Number} aspectRatio
     * @param {Number} nearPlaneDistance
     * @param {Number} farPlaneDistance
     * @return {ThreeDmal.Matrix4x4}
     */
    createPerspectiveFieldOfViewMatrix:function (fieldOfView, aspectRatio, nearPlaneDistance, farPlaneDistance) {
        var num = 1 / Math.tan(fieldOfView * 0.5);
        var num9 = num / aspectRatio;
        var result = new ThreeDmal.Matrix4x4();
        result[0] = num9;
        result[5] = num;
        result[10] = farPlaneDistance / (nearPlaneDistance - farPlaneDistance);
        result[11] = -1;
        result[14] = (nearPlaneDistance * farPlaneDistance) / (nearPlaneDistance - farPlaneDistance);
        
        return result;
    },

    /**
     * @param {Number} yaw
     * @param {Number} pitch
     * @param {Number} roll
     * @return {ThreeDmal.Matrix4x4}
     */
    createRotationMatrix:function (yaw, pitch, roll) {
        var quaternion = [],
            num9 = roll * 0.5,
            num6 = Math.sin(num9),
            num5 = Math.cos(num9),
            num8 = pitch * 0.5,
            num4 = Math.sin(num8),
            num3 = Math.cos(num8),
            num7 = yaw * 0.5,
            num2 = Math.sin(num7),
            num = Math.cos(num7);
        quaternion[0] = ((num * num4) * num5) + ((num2 * num3) * num6);
        quaternion[1] = ((num2 * num3) * num5) - ((num * num4) * num6);
        quaternion[2] = ((num * num3) * num6) - ((num2 * num4) * num5);
        quaternion[3] = ((num * num3) * num5) + ((num2 * num4) * num6);

        num9 = quaternion[0] * quaternion[0];
        num8 = quaternion[1] * quaternion[1];
        num7 = quaternion[2] * quaternion[2];
        num6 = quaternion[0] * quaternion[1];
        num5 = quaternion[2] * quaternion[3];
        num4 = quaternion[2] * quaternion[0];
        num3 = quaternion[1] * quaternion[3];
        num2 = quaternion[1] * quaternion[2];
        num = quaternion[0] * quaternion[3];

        var result = new ThreeDmal.Matrix4x4();
        result[0] = 1 - (2 * (num8 + num7));
        result[1] = 2 * (num6 + num5);
        result[2] = 2 * (num4 - num3);
        result[4] = 2 * (num6 - num5);
        result[5] = 1 - (2 * (num7 + num9));
        result[6] = 2 * (num2 + num);
        result[8] = 2 * (num4 + num3);
        result[9] = 2 * (num2 - num);
        result[10] = 1 - (2 * (num8 + num9));
        result[15] = 1;
        
        return result;
    },

    /**
     * @param {ThreeDmal.Vector3} value
     * @return {ThreeDmal.Matrix4x4}
     */
    createScaleMatrix:function (value) {
        var result = new ThreeDmal.Matrix4x4();
        result[0] = value.x;
        result[5] = value.y;
        result[10] = value.z;
        result[15] = 1;

        return result;
    },

    /**
     * @param {ThreeDmal.Vector3} position
     * @return {ThreeDmal.Matrix4x4}
     */
    createTranslationMatrix:function (position) {
        var result = new ThreeDmal.Matrix4x4();
        result[0] = 1;
        result[5] = 1;
        result[10] = 1;
        result[12] = position.x;
        result[13] = position.y;
        result[14] = position.z;
        result[15] = 1;
        
        return result;
    },

    /**
     * @param {ThreeDmal.Vector3} vector1
     * @param {ThreeDmal.Vector3} vector2
     * @return {ThreeDmal.Vector3}
     */
    crossProductVector3:function (vector1, vector2) {
        var x = (vector1.y * vector2.z) - (vector1.z * vector2.y),
            y = (vector1.z * vector2.x) - (vector1.x * vector2.z),
            z = (vector1.x * vector2.y) - (vector1.y * vector2.x);
        
        return new ThreeDmal.Vector3(x, y, z);
    },

    /**
     * @param {ThreeDmal.Vector3} vector1
     * @param {ThreeDmal.Vector3} vector2
     * @return {Number}
     */
    dotProductVector3:function (vector1, vector2) {
        return (vector1.x * vector2.x) + (vector1.y * vector2.y) + (vector1.z * vector2.z);
    },

    /**
     * @param {ThreeDmal.Matrix4x4} m1
     * @param {ThreeDmal.Matrix4x4} m2
     * @return {ThreeDmal.Matrix4x4}
     */
    multiplyMatrixMatrix:function (m1, m2) {
        var result = new ThreeDmal.Matrix4x4();
        result[0] = (m1[0] * m2[0]) + (m1[1] * m2[4]) + (m1[2] * m2[8]) + (m1[3] * m2[12]);
        result[1] = (m1[0] * m2[1]) + (m1[1] * m2[5]) + (m1[2] * m2[9]) + (m1[3] * m2[13]);
        result[2] = (m1[0] * m2[2]) + (m1[1] * m2[6]) + (m1[2] * m2[10]) + (m1[3] * m2[14]);
        result[3] = (m1[0] * m2[3]) + (m1[1] * m2[7]) + (m1[2] * m2[11]) + (m1[3] * m2[15]);
        result[4] = (m1[4] * m2[0]) + (m1[5] * m2[4]) + (m1[6] * m2[8]) + (m1[7] * m2[12]);
        result[5] = (m1[4] * m2[1]) + (m1[5] * m2[5]) + (m1[6] * m2[9]) + (m1[7] * m2[13]);
        result[6] = (m1[4] * m2[2]) + (m1[5] * m2[6]) + (m1[6] * m2[10]) + (m1[7] * m2[14]);
        result[7] = (m1[4] * m2[3]) + (m1[5] * m2[7]) + (m1[6] * m2[11]) + (m1[7] * m2[15]);
        result[8] = (m1[8] * m2[0]) + (m1[9] * m2[4]) + (m1[10] * m2[8]) + (m1[11] * m2[12]);
        result[9] = (m1[8] * m2[1]) + (m1[9] * m2[5]) + (m1[10] * m2[9]) + (m1[11] * m2[13]);
        result[10] = (m1[8] * m2[2]) + (m1[9] * m2[6]) + (m1[10] * m2[10]) + (m1[11] * m2[14]);
        result[11] = (m1[8] * m2[3]) + (m1[9] * m2[7]) + (m1[10] * m2[11]) + (m1[11] * m2[15]);
        result[12] = (m1[12] * m2[0]) + (m1[13] * m2[4]) + (m1[14] * m2[8]) + (m1[15] * m2[12]);
        result[13] = (m1[12] * m2[1]) + (m1[13] * m2[5]) + (m1[14] * m2[9]) + (m1[15] * m2[13]);
        result[14] = (m1[12] * m2[2]) + (m1[13] * m2[6]) + (m1[14] * m2[10]) + (m1[15] * m2[14]);
        result[15] = (m1[12] * m2[3]) + (m1[13] * m2[7]) + (m1[14] * m2[11]) + (m1[15] * m2[15]);

        return result;
    },

    /**
     * @param {ThreeDmal.Vector4} vector
     * @param {ThreeDmal.Matrix4x4} matrix
     * @return {ThreeDmal.Vector4}
     */
    multiplyVector4Matrix:function (vector, matrix) {
        var vx = vector.x,
            vy = vector.y,
            vz = vector.z,
            vw = vector.w,
            x = (vx * matrix[0]) + (vy * matrix[4]) + (vz * matrix[8]) + (vw * matrix[12]),
            y = (vx * matrix[1]) + (vy * matrix[5]) + (vz * matrix[9]) + (vw * matrix[13]),
            z = (vx * matrix[2]) + (vy * matrix[6]) + (vz * matrix[10]) + (vw * matrix[14]),
            w = (vx * matrix[3]) + (vy * matrix[7]) + (vz * matrix[11]) + (vw * matrix[15]);

        return new ThreeDmal.Vector4(x, y, z, w);
    },

    /**
     * @param {ThreeDmal.Vector4} point
     * @param {ThreeDmal.Matrix4x4} worldViewProjectionMatrix
     * @param {Number} screenWidth
     * @param {Number} screenHeight
     * @return {ThreeDmal.Vector2}
     */
    project:function (point, worldViewProjectionMatrix, screenWidth, screenHeight) {
        var vx = point.x,
            vy = point.y,
            vz = point.z,
            vw = point.w,
            x1 = (vx * worldViewProjectionMatrix[0]) 
                + (vy * worldViewProjectionMatrix[4]) 
                + (vz * worldViewProjectionMatrix[8]) 
                + (vw * worldViewProjectionMatrix[12]),
            y1 = (vx * worldViewProjectionMatrix[1]) 
                + (vy * worldViewProjectionMatrix[5]) 
                + (vz * worldViewProjectionMatrix[9]) 
                + (vw * worldViewProjectionMatrix[13]),
            z1 = (vx * worldViewProjectionMatrix[2]) 
                + (vy * worldViewProjectionMatrix[6]) 
                + (vz * worldViewProjectionMatrix[10]) 
                + (vw * worldViewProjectionMatrix[14]);

        return new ThreeDmal.Vector2(
            screenWidth * ((x1 / z1) + 1.0) / 2.0, 
            screenHeight * (1.0 - (((y1 / z1) + 1.0) / 2.0)));
    },

    /**
     * @param {ThreeDmal.Vector3} vector1
     * @param {ThreeDmal.Vector3} vector2
     * @return {ThreeDmal.Vector3}
     */
    substractVector3:function (vector1, vector2) {
        return new ThreeDmal.Vector3(
            vector1.x - vector2.x,
            vector1.y - vector2.y,
            vector1.z - vector2.z);
    },

    /**
     * Represents a 3D camera
     * @param {Number} viewportWidth
     * @param {Number} viewportHeight
     * @constructor
     */
    Camera:function (viewportWidth, viewportHeight) {
        var that = this;
        this.position = new ThreeDmal.Vector3(1, 1, 1);
        this.target = new ThreeDmal.Vector3(0, 0, 0);
        this.up = new ThreeDmal.Vector3(0, 1, 0);
        const aspectRatio = viewportWidth / viewportHeight;
        this.projectionMatrix = ThreeDmal.createPerspectiveFieldOfViewMatrix(Math.PI / 4, aspectRatio, 1, 1000);
        this.viewProjectionMatrix = null;

        /**
         * @param {ThreeDmal.Vector3} value
         */
        this.setPosition = function (value) {
            that.position = value;
            that._refreshViewProjectionMatrices();
        };

        this._refreshViewProjectionMatrices = function () {
            const viewMatrix = ThreeDmal.createLookAtMatrix(that.position, that.target, that.up);
            that.viewProjectionMatrix = ThreeDmal.multiplyMatrixMatrix(viewMatrix, that.projectionMatrix);
        };

        this._refreshViewProjectionMatrices();
    },

    /**
     * Represents a 3D model
     * @constructor
     */
    Model:function () {
        var that = this;
        this.vertices = new Array();
        this.indices = new Array();
        this.position = new ThreeDmal.Vector3(0, 0, 0);
        this.rotation = new ThreeDmal.Vector3(0, 0, 0);
        this.scale = new ThreeDmal.Vector3(1, 1, 1);

        /**
         * @param {Number} x
         * @param {Number} y
         * @param {Number} z
         */
        this.addVertex = function (x, y, z) {
            var position = that.vertices.length;
            // TODO why 4th dimension is needed?
            that.vertices[position] = new ThreeDmal.Vector4(x, y, z, 1);
        };

        /**
         * @param {Number} vertex1Position
         * @param {Number} vertex2Position
         * @param {Number} vertex3Position
         */
        this.addTriangle = function (vertex1Position, vertex2Position, vertex3Position) {
            var position = that.indices.length;
            that.indices[position] = vertex1Position;
            that.indices[position + 1] = vertex2Position;
            that.indices[position + 2] = vertex3Position;
        };

        /**
         * @param {ThreeDmal.Vector3} value
         */
        this.setRotation = function (value) {
            that.rotation = value;
            that._refreshWorldMatrix();
        };

        this._refreshWorldMatrix = function () {
            var rotationMatrix = ThreeDmal.createRotationMatrix(that.rotation.y, that.rotation.x, that.rotation.z),
                scaleMatrix = ThreeDmal.createScaleMatrix(that.scale),
                translationMatrix = ThreeDmal.createTranslationMatrix(that.position);
            that.worldMatrix = ThreeDmal.multiplyMatrixMatrix(scaleMatrix, translationMatrix);
            that.worldMatrix = ThreeDmal.multiplyMatrixMatrix(rotationMatrix, that.worldMatrix);
        };
        
        this._refreshWorldMatrix();
    },

    /**
     * Represents a 3D scene
     * @param canvas A HTML Canvas
     * @constructor
     */
    Scene:function (canvas) {
        var that = this;
        this.models = new Array();
        this.camera = null;
        this.context = null;

        try {
            this.context = canvas.getContext("2d");
        } catch (e) {
            alert("Canvas not valid");
        }

        this.width = canvas.width;
        this.height = canvas.height;

        /**
         * @param {ThreeDmal.Model} model
         */
        this.addModel = function (model) {
            var position = that.models.length;
            that.models[position] = model;
        };

        this.draw = function () {
            var models = that.models;
            that.context.clearRect(0, 0, that.width, that.height);
            
            for (var i = 0; i < models.length; i++) {
                var model = models[i],
                vertices = [];
                
                for (var j = 0; j < model.vertices.length; j++) {
                    vertices[j] = ThreeDmal.multiplyVector4Matrix(model.vertices[j], model.worldMatrix);
                }
                
                const indices = model.indices,
                trianglesCount = indices.length / 3;
                that.context.beginPath();
                that.context.strokeStyle = "rgba(0, 0, 0, 1)";
    
                for (var k = 0; k < trianglesCount; k++) {
                    var index = k * 3,
                        vertex1 = vertices[indices[index]],
                        vertex2 = vertices[indices[index + 1]],
                        vertex3 = vertices[indices[index + 2]],
                        point1 = ThreeDmal.project(vertex1, that.camera.viewProjectionMatrix, that.width, that.height),
                        point2 = ThreeDmal.project(vertex2, that.camera.viewProjectionMatrix, that.width, that.height),
                        point3 = ThreeDmal.project(vertex3, that.camera.viewProjectionMatrix, that.width, that.height);
                    that.context.moveTo(point1.x, point1.y);
                    that.context.lineTo(point2.x, point2.y);
                    that.context.lineTo(point3.x, point3.y);
                    that.context.lineTo(point1.x, point1.y);
                }
    
                that.context.stroke();
                that.context.closePath();
            }
        };

        /**
         * @param {ThreeDmal.Camera} camera
         */
        this.setCamera = function (camera) {
            that.camera = camera;
        };
    }
};
