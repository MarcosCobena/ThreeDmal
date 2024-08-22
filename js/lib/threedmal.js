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
     * Represents a 3D camera
     * @param {Number} viewportWidth
     * @param {Number} viewportHeight
     * @constructor
     */
    Camera:function (viewportWidth, viewportHeight) {
        var that = this;
        this.position = [0, 0, 15];
        this.target = [0, 0, 0];
        this.upVector = [0, 1, 0];
        const aspectRatio = viewportWidth / viewportHeight;
        this.projectionMatrix = ThreeDmalMath.createPerspectiveFieldOfViewMatrix(Math.PI / 4, aspectRatio, 1, 1000);

        /**
         * @param {Array} position 3D vector
         */
        this.setPosition = function (position) {
            that.position = position;
            that._refreshViewProjectionMatrices();
        };

        this._refreshViewProjectionMatrices = function () {
            that.viewMatrix = ThreeDmalMath.createLookAtMatrix(that.position, that.target, that.upVector);
            that.viewProjectionMatrix = ThreeDmalMath.multiplyMatrixMatrix(that.viewMatrix, that.projectionMatrix);
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
        this.position = [0, 0, 0];
        this.rotation = [0, 0, 0];
        this.scale = [1, 1, 1];

        /**
         * @param {Number} x
         * @param {Number} y
         * @param {Number} z
         */
        this.addVertex = function (x, y, z) {
            var position = that.vertices.length;
            // TODO why 4th dimension is needed?
            that.vertices[position] = [ x, y, z, 1 ];
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
         * @param {Number} x
         * @param {Number} y
         * @param {Number} z
         */
        this.changePosition = function (x, y, z) {
            that.position[0] = x;
            that.position[1] = y;
            that.position[2] = z;
            that._refreshWorldMatrix();
        };

        /**
         * @param {Number} x
         * @param {Number} y
         * @param {Number} z
         */
        this.changeRotation = function (x, y, z) {
            that.rotation[0] = x;
            that.rotation[1] = y;
            that.rotation[2] = z;
            that._refreshWorldMatrix();
        };

        /**
         * @param {Number} x
         * @param {Number} y
         * @param {Number} z
         */
        this.changeScale = function (x, y, z) {
            that.scale[0] = x;
            that.scale[1] = y;
            that.scale[2] = z;
            that._refreshWorldMatrix();
        };

        this._refreshWorldMatrix = function () {
            var rotationMatrix = ThreeDmalMath.createRotationMatrix(that.rotation[1], that.rotation[0], that.rotation[2]),
                scaleMatrix = ThreeDmalMath.createScaleMatrix(that.scale[0], that.scale[1], that.scale[2]),
                translationMatrix = ThreeDmalMath.createTranslationMatrix(that.position);
            that.worldMatrix = ThreeDmalMath.multiplyMatrixMatrix(scaleMatrix, translationMatrix);
            that.worldMatrix = ThreeDmalMath.multiplyMatrixMatrix(rotationMatrix, that.worldMatrix);
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
                    vertices[j] = ThreeDmalMath.multiplyVector4Matrix(model.vertices[j], model.worldMatrix);
                }

                const indices = model.indices,
                trianglesCount = indices.length / 3;
                that.context.beginPath();
                that.context.strokeStyle = "rgba(0, 0, 0, 1)";
    
                for (var i = 0; i < trianglesCount; i++) {
                    var index = i * 3,
                        p1 = vertices[indices[index]],
                        p2 = vertices[indices[index + 1]],
                        p3 = vertices[indices[index + 2]],
                        vertex1 = ThreeDmalMath.project(p1, that.camera.viewProjectionMatrix, that.width, that.height),
                        vertex2 = ThreeDmalMath.project(p2, that.camera.viewProjectionMatrix, that.width, that.height),
                        vertex3 = ThreeDmalMath.project(p3, that.camera.viewProjectionMatrix, that.width, that.height);
                    that.context.moveTo(vertex1[0], vertex1[1]);
                    that.context.lineTo(vertex2[0], vertex2[1]);
                    that.context.lineTo(vertex3[0], vertex3[1]);
                    that.context.lineTo(vertex1[0], vertex1[1]);
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

var ThreeDmalMath = {

    /**
     * Creates an instance of a 4x4 matrix filled with zeros.
     * 
     * The matrix is stored as a 1D array in column-major order:
     *    0  1  2  3
     *    4  5  6  7
     *    8  9 10 11
     *   12 13 14 15
     * @constructor
     * @return {ThreeDmalMath.Matrix}
     */
    Matrix:function () {
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
     * Creates an identity matrix
     * @return {ThreeDmalMath.Matrix}
     */
    createIdentityMatrix:function () {
        var matrix = new ThreeDmalMath.Matrix();
        matrix[0] = 1;
        matrix[5] = 1;
        matrix[10] = 1;
        matrix[15] = 1;
        
        return matrix;
    },

    /**
     * Creates a look-at matrix for the scene
     * @param {Array} cameraPosition Array with the camera position
     * @param {Array} cameraTarget Array with the target position
     * @param {Array} cameraUpVector Array with the camera's vector up
     * @return {ThreeDmalMath.Matrix}
     */
    createLookAtMatrix:function (cameraPosition, cameraTarget, cameraUpVector) {
        var matrix = new ThreeDmalMath.Matrix();
        var vector = ThreeDmalMath.substractVector3(cameraPosition, cameraTarget);
        ThreeDmalMath.normalizeVector3(vector);
        var vector2 = ThreeDmalMath.crossProductVector3(cameraUpVector, vector);
        ThreeDmalMath.normalizeVector3(vector2);
        var vector3 = ThreeDmalMath.crossProductVector3(vector, vector2);

        matrix[0] = vector2[0];
        matrix[1] = vector3[0];
        matrix[2] = vector[0];
        matrix[3] = 0;
        matrix[4] = vector2[1];
        matrix[5] = vector3[1];
        matrix[6] = vector[1];
        matrix[7] = 0;
        matrix[8] = vector2[2];
        matrix[9] = vector3[2];
        matrix[10] = vector[2];
        matrix[11] = 0;
        matrix[12] = -ThreeDmalMath.dotProductVector3(vector2, cameraPosition);
        matrix[13] = -ThreeDmalMath.dotProductVector3(vector3, cameraPosition);
        matrix[14] = -ThreeDmalMath.dotProductVector3(vector, cameraPosition);
        matrix[15] = 1;

        return matrix;
    },

    /**
     * Creates a perspective field-of-view matrix
     * @param {Number} fieldOfView
     * @param {Number} aspectRatio
     * @param {Number} nearPlaneDistance
     * @param {Number} farPlaneDistance
     * @return {ThreeDmalMath.Matrix}
     */
    createPerspectiveFieldOfViewMatrix:function (fieldOfView, aspectRatio, nearPlaneDistance, farPlaneDistance) {
        var matrix = new ThreeDmalMath.Matrix();
        var num = 1 / Math.tan(fieldOfView * 0.5);
        var num9 = num / aspectRatio;
        matrix[0] = num9;
        matrix[1] = matrix[2] = matrix[3] = 0;
        matrix[5] = num;
        matrix[4] = matrix[6] = matrix[7] = 0;
        matrix[8] = matrix[9] = 0;
        matrix[10] = farPlaneDistance / (nearPlaneDistance - farPlaneDistance);
        matrix[11] = -1;
        matrix[12] = matrix[13] = matrix[15] = 0;
        matrix[14] = (nearPlaneDistance * farPlaneDistance) / (nearPlaneDistance - farPlaneDistance);
        
        return matrix;
    },

    /**
     * Creates the rotation matrix from yaw, pitch and roll
     * @param {number} yaw
     * @param {number} pitch
     * @param {number} roll
     * @return {ThreeDmalMath.Matrix}
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

        var matrix = new ThreeDmalMath.Matrix();
        matrix[0] = 1 - (2 * (num8 + num7));
        matrix[1] = 2 * (num6 + num5);
        matrix[2] = 2 * (num4 - num3);
        matrix[3] = 0;
        matrix[4] = 2 * (num6 - num5);
        matrix[5] = 1 - (2 * (num7 + num9));
        matrix[6] = 2 * (num2 + num);
        matrix[7] = 0;
        matrix[8] = 2 * (num4 + num3);
        matrix[9] = 2 * (num2 - num);
        matrix[10] = 1 - (2 * (num8 + num9));
        matrix[11] = 0;
        matrix[12] = 0;
        matrix[13] = 0;
        matrix[14] = 0;
        matrix[15] = 1;
        
        return matrix;
    },

    /**
     * Creates a scale matrix
     * @param {number} xScale The scale in x-axis
     * @param {number} yScale The scale in y-axis
     * @param {number} zScale The scale in z-axis
     * @return {ThreeDmalMath.Matrix}
     */
    createScaleMatrix:function (xScale, yScale, zScale) {
        var matrix = new ThreeDmalMath.Matrix();
        matrix[0] = xScale;
        matrix[1] = 0;
        matrix[2] = 0;
        matrix[3] = 0;
        matrix[4] = 0;
        matrix[5] = yScale;
        matrix[6] = 0;
        matrix[7] = 0;
        matrix[8] = 0;
        matrix[9] = 0;
        matrix[10] = zScale;
        matrix[11] = 0;
        matrix[12] = 0;
        matrix[13] = 0;
        matrix[14] = 0;
        matrix[15] = 1;

        return matrix;
    },

    /**
     * Creates a translation matrix
     * @param {Array} vector3 The new position
     * @return {ThreeDmalMath.Matrix}
     */
    createTranslationMatrix:function (vector3) {
        var matrix = new ThreeDmalMath.Matrix();
        matrix[0] = 1;
        matrix[1] = 0;
        matrix[2] = 0;
        matrix[3] = 0;
        matrix[4] = 0;
        matrix[5] = 1;
        matrix[6] = 0;
        matrix[7] = 0;
        matrix[8] = 0;
        matrix[9] = 0;
        matrix[10] = 1;
        matrix[11] = 0;
        matrix[12] = vector3[0];
        matrix[13] = vector3[1];
        matrix[14] = vector3[2];
        matrix[15] = 1;
        
        return matrix;
    },

    /**
     * Cross product of two 3D vectors
     * @param {Array} vector1
     * @param {Array} vector2
     * @return {Array}
     */
    crossProductVector3:function (vector1, vector2) {
        var x = (vector1[1] * vector2[2]) - (vector1[2] * vector2[1]),
            y = (vector1[2] * vector2[0]) - (vector1[0] * vector2[2]),
            z = (vector1[0] * vector2[1]) - (vector1[1] * vector2[0]);
        
        return [x, y, z];
    },

    /**
     * Dot product of two 3D vectors
     * @param {Array} vector1
     * @param {Array} vector2
     * @return {Number}
     */
    dotProductVector3:function (vector1, vector2) {
        return (vector1[0] * vector2[0]) +
            (vector1[1] * vector2[1]) +
            (vector1[2] * vector2[2]);
    },

    /**
     * @param {ThreeDmalMath.Matrix} matrix1
     * @param {ThreeDmalMath.Matrix} matrix2
     * @return {ThreeDmalMath.Matrix}
     */
    multiplyMatrixMatrix:function (matrix1, matrix2) {
        var result = new ThreeDmalMath.Matrix();
        result[0] = (matrix1[0] * matrix2[0]) + (matrix1[1] * matrix2[4]) + (matrix1[2] * matrix2[8]) + (matrix1[3] * matrix2[12]);
        result[1] = (matrix1[0] * matrix2[1]) + (matrix1[1] * matrix2[5]) + (matrix1[2] * matrix2[9]) + (matrix1[3] * matrix2[13]);
        result[2] = (matrix1[0] * matrix2[2]) + (matrix1[1] * matrix2[6]) + (matrix1[2] * matrix2[10]) + (matrix1[3] * matrix2[14]);
        result[3] = (matrix1[0] * matrix2[3]) + (matrix1[1] * matrix2[7]) + (matrix1[2] * matrix2[11]) + (matrix1[3] * matrix2[15]);
        result[4] = (matrix1[4] * matrix2[0]) + (matrix1[5] * matrix2[4]) + (matrix1[6] * matrix2[8]) + (matrix1[7] * matrix2[12]);
        result[5] = (matrix1[4] * matrix2[1]) + (matrix1[5] * matrix2[5]) + (matrix1[6] * matrix2[9]) + (matrix1[7] * matrix2[13]);
        result[6] = (matrix1[4] * matrix2[2]) + (matrix1[5] * matrix2[6]) + (matrix1[6] * matrix2[10]) + (matrix1[7] * matrix2[14]);
        result[7] = (matrix1[4] * matrix2[3]) + (matrix1[5] * matrix2[7]) + (matrix1[6] * matrix2[11]) + (matrix1[7] * matrix2[15]);
        result[8] = (matrix1[8] * matrix2[0]) + (matrix1[9] * matrix2[4]) + (matrix1[10] * matrix2[8]) + (matrix1[11] * matrix2[12]);
        result[9] = (matrix1[8] * matrix2[1]) + (matrix1[9] * matrix2[5]) + (matrix1[10] * matrix2[9]) + (matrix1[11] * matrix2[13]);
        result[10] = (matrix1[8] * matrix2[2]) + (matrix1[9] * matrix2[6]) + (matrix1[10] * matrix2[10]) + (matrix1[11] * matrix2[14]);
        result[11] = (matrix1[8] * matrix2[3]) + (matrix1[9] * matrix2[7]) + (matrix1[10] * matrix2[11]) + (matrix1[11] * matrix2[15]);
        result[12] = (matrix1[12] * matrix2[0]) + (matrix1[13] * matrix2[4]) + (matrix1[14] * matrix2[8]) + (matrix1[15] * matrix2[12]);
        result[13] = (matrix1[12] * matrix2[1]) + (matrix1[13] * matrix2[5]) + (matrix1[14] * matrix2[9]) + (matrix1[15] * matrix2[13]);
        result[14] = (matrix1[12] * matrix2[2]) + (matrix1[13] * matrix2[6]) + (matrix1[14] * matrix2[10]) + (matrix1[15] * matrix2[14]);
        result[15] = (matrix1[12] * matrix2[3]) + (matrix1[13] * matrix2[7]) + (matrix1[14] * matrix2[11]) + (matrix1[15] * matrix2[15]);

        return result;
    },

    /**
     * @param {Array} vector4
     * @param {ThreeDmalMath.Matrix} matrix
     * @return {Array} 4D vector
     */
    multiplyVector4Matrix:function (vector4, matrix) {
        var vx = vector4[0],
            vy = vector4[1],
            vz = vector4[2],
            vw = vector4[3],
            x = (((vx * matrix[0]) + (vy * matrix[4])) + (vz * matrix[8])) + (vw * matrix[12]),
            y = (((vx * matrix[1]) + (vy * matrix[5])) + (vz * matrix[9])) + (vw * matrix[13]),
            z = (((vx * matrix[2]) + (vy * matrix[6])) + (vz * matrix[10])) + (vw * matrix[14]),
            w = (((vx * matrix[3]) + (vy * matrix[7])) + (vz * matrix[11])) + (vw * matrix[15]);

        return [x, y, z, w];
    },

    /**
     * Normalizes a 3D vector
     * @param {Array} value
     */
    normalizeVector3:function (value) {
        var x = value[0],
            y = value[1],
            z = value[2],
            num2 = ((x * x) + (y * y)) + (z * z),
            num = 1 / Math.sqrt(num2);

        value[0] = x * num;
        value[1] = y * num;
        value[2] = z * num;
    },

    /**
     * Projects a 3D point into a 2D one (screen space)
     * @param {Array} point3D
     * @param {ThreeDmalMath.Matrix} worldViewProjectionMatrix
     * @param {number} screenWidth
     * @param {number} screenHeight
     * @return {Array}
     */
    project:function (point3D, worldViewProjectionMatrix, screenWidth, screenHeight) {
        var vx = point3D[0],
            vy = point3D[1],
            vz = point3D[2],
            vw = point3D[3],
            x1 = (((vx * worldViewProjectionMatrix[0]) + (vy * worldViewProjectionMatrix[4])) + (vz * worldViewProjectionMatrix[8])) + (vw * worldViewProjectionMatrix[12]),
            y1 = (((vx * worldViewProjectionMatrix[1]) + (vy * worldViewProjectionMatrix[5])) + (vz * worldViewProjectionMatrix[9])) + (vw * worldViewProjectionMatrix[13]),
            z1 = (((vx * worldViewProjectionMatrix[2]) + (vy * worldViewProjectionMatrix[6])) + (vz * worldViewProjectionMatrix[10])) + (vw * worldViewProjectionMatrix[14]),
            w1 = (((vx * worldViewProjectionMatrix[3]) + (vy * worldViewProjectionMatrix[7])) + (vz * worldViewProjectionMatrix[11])) + (vw * worldViewProjectionMatrix[15]),
            position = [x1, y1, z1, w1],
            x = position[0],
            y = position[1],
            w = position[2];

        return [screenWidth * ((x / w) + 1.0) / 2.0, screenHeight * (1.0 - (((y / w) + 1.0) / 2.0))];
    },

    /**
     * Substracts two 3D vectors
     * @param {Array} vector1
     * @param {Array} vector2
     * @return {Array}
     */
    substractVector3:function (vector1, vector2) {
        return [vector1[0] - vector2[0],
            vector1[1] - vector2[1],
            vector1[2] - vector2[2]];
    },

};
