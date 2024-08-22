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
     * Represents a camera for the scene
     * @param {Number} width Scene width
     * @param {Number} height Scene height
     * @constructor
     */
    Camera:function (width, height) {
        var that = this;
        this.cameraPosition = [0, 0, 15];
        this.cameraTarget = [0, 0, 0];
        this.cameraUpVector = [0, 1, 0];
        this.width = width;
        this.height = height;
        this.aspectRatio = this.width / this.height;
        this.view = ThreeDmalMath.createLookAtMatrix(this.cameraPosition, this.cameraTarget, this.cameraUpVector);
        this.projection = ThreeDmalMath.createPerspectiveFieldOfViewMatrix(Math.PI / 4, this.aspectRatio, 1, 1000);
        this.viewproj = ThreeDmalMath.multiply(this.view, this.projection);

        /**
         * Get the camera position
         * @return {Array}
         */
        this.getPosition = function () {
            return that.cameraPosition;
        };

        /**
         * Changes the camera position
         * @param {Array} position 3D vector
         */
        this.changeCameraPosition = function (position) {
            that.cameraPosition = position;
            that.changeViewProj();
        };

        /**
         * Changes the camera target
         * @param {Array} target 3D vector
         */
        this.changeCameraTarget = function (target) {
            that.cameraTarget = target;
            that.changeViewProj();
        };

        /**
         * Changes the camera Up Vector
         * @param {Array} upVector 3D vector
         */
        this.changeCameraUpVector = function (upVector) {
            that.cameraUpVector = upVector;
            that.changeViewProj();
        };

        /**
         * Changes the camera LookAt
         * @param {Array} cameraPosition 3D Vector
         * @param {Array} cameraTarget 3D Vector
         * @param {Array} cameraUpVector 3D Vector
         */
        this.changeLookAt = function (cameraPosition, cameraTarget, cameraUpVector) {
            that.cameraPosition = cameraPosition;
            that.cameraTarget = cameraTarget;
            that.cameraUpVector = cameraUpVector;
            that.changeViewProj();
        };

        /**
         * Changes the new View Projection Matrix
         */
        this.changeViewProj = function () {
            that.view = ThreeDmalMath.createLookAtMatrix(that.cameraPosition, that.cameraTarget, that.cameraUpVector);
            that.viewproj = ThreeDmalMath.multiply(that.view, that.projection);
        };
    },

    /**
     * Represents a model in a 3D scene
     * @param {String} id Model ID (optional)
     * @constructor
     */
    Model:function (id) {
        var that = this;
        this.id = id;
        this.vertices = new Array();
        this.index = new Array();
        this.position = [0, 0, 0];
        this.rotation = [0, 0, 0];
        this.scale = [1, 1, 1];
        this.backfaceCulling = true;
        this.world = new ThreeDmalMath.createIdentityMatrix();
        this.refreshedBoudingBox = false;

        /**
         * Adds a new vertex to the model
         * @param {Number} x
         * @param {Number} y
         * @param {Number} z
         */
        this.addVertex = function (x, y, z) {
            var position = that.vertices.length;
            that.vertices[position] = [ x, y, z, 1 ];
        };

        /**
         * Adds a new triangle to the model
         * @param {Number} vertex1Position
         * @param {Number} vertex2Position
         * @param {Number} vertex3Position
         */
        this.addTriangle = function (vertex1Position, vertex2Position, vertex3Position) {
            var position = that.index.length;
            that.index[position] = vertex1Position;
            that.index[position + 1] = vertex2Position;
            that.index[position + 2] = vertex3Position;
        };

        /**
         * Updates the world matrix
         */
        this.refreshWorld = function () {
            var rotationMatrix = ThreeDmalMath.createRotationMatrix(that.rotation[1], that.rotation[0], that.rotation[2]),
                scaleMatrix = ThreeDmalMath.createScaleMatrix(that.scale[0], that.scale[1], that.scale[2]),
                translationMatrix = ThreeDmalMath.createTranslationMatrix(that.position);
            that.world = ThreeDmalMath.multiply(scaleMatrix, translationMatrix);
            that.world = ThreeDmalMath.multiply(rotationMatrix, that.world);
            that.refreshedBoudingBox = false;
        };

        /**
         * Changes the model position
         * @param {Number} x
         * @param {Number} y
         * @param {Number} z
         */
        this.changePosition = function (x, y, z) {
            that.position[0] = x;
            that.position[1] = y;
            that.position[2] = z;
            that.refreshWorld();
        };

        /**
         * Changes the model rotation
         * @param {Number} x
         * @param {Number} y
         * @param {Number} z
         */
        this.changeRotation = function (x, y, z) {
            that.rotation[0] = x;
            that.rotation[1] = y;
            that.rotation[2] = z;
            that.refreshWorld();
        };

        /**
         * Changes the model Scale
         * @param {Number} x
         * @param {Number} y
         * @param {Number} z
         */
        this.changeScale = function (x, y, z) {
            that.scale[0] = x;
            that.scale[1] = y;
            that.scale[2] = z;
            that.refreshWorld();
        };

        /**
         * Get the distance between a vector and a model
         * @param {Array} vector 3D vector with the camera position
         * @return {Number}
         */
        this.getDistanceToCamera = function (vector) {
            return Math.sqrt(((vector[0] - that.position[0]) * (vector[0] - that.position[0])) + ((vector[1] - that.position[1]) * (vector[1] - that.position[1])) + ((vector[2] - that.position[2]) * (vector[2] - that.position[2])));
        };
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
         * Adds a model to the scene
         * @param {ThreeDmal.Model} model
         * @return {Number}
         */
        this.addModel = function (model) {
            var position = that.models.length;
            that.models[position] = model;
            return position;
        };

        /**
         * Draws the scene
         */
        this.draw = function () {
            that._clearScreen();
            var models = that.models;

            for (var i = 0; i < models.length; i++) {
                var model = models[i],
                    vertices = [];

                for (var j = 0; j < model.vertices.length; j++) {
                    vertices[j] = ThreeDmalMath.transformVector4(model.vertices[j], model.world);
                }

                that.context.beginPath();
                that._drawEdges(vertices, model);
                that.context.closePath();
            }
        };

        /**
         * Sets the scene's camera
         * @param {ThreeDmal.Camera} camera
         */
        this.setCamera = function (camera) {
            that.camera = camera;
        };

        /**
         * Clears the canvas
         */
        this._clearScreen = function () {
            that.context.clearRect(0, 0, that.width, that.height);
        };

        /**
         * Draws only the model's edges
         * @param {Array} vertices Model's vertices
         * @param {ThreeDmal.Model} model
         */
        this._drawEdges = function (vertices, model) {
            var indexes = model.index,
                pc = that.camera.getPosition();
            that.context.strokeStyle = "rgba(0, 0, 0, 1)";

            for (var i = 0; i < indexes.length / 3; i++) {
                var index = i * 3,
                    p1 = vertices[indexes[index]],
                    p2 = vertices[indexes[index + 1]],
                    p3 = vertices[indexes[index + 2]],
                    v1 = ThreeDmalMath.substractVector3(p1, p2),
                    v2 = ThreeDmalMath.substractVector3(p3, p2),
                    n = ThreeDmalMath.crossProductVector3(v1, v2),
                    c = ThreeDmalMath.substractVector3(pc, p1),
                    tita = ThreeDmalMath.dotProductVector3(c, n);

                if (!model.backfaceCulling || tita < 0) {
                    var vertex1 = ThreeDmalMath.project(p1, that.camera.viewproj, that.width, that.height);
                    var vertex2 = ThreeDmalMath.project(p2, that.camera.viewproj, that.width, that.height);
                    var vertex3 = ThreeDmalMath.project(p3, that.camera.viewproj, that.width, that.height);
                    that.context.moveTo(vertex1[0], vertex1[1]);
                    that.context.lineTo(vertex2[0], vertex2[1]);
                    that.context.lineTo(vertex3[0], vertex3[1]);
                    that.context.lineTo(vertex1[0], vertex1[1]);
                }
            }

            that.context.stroke();
        };
    }
};

var ThreeDmalMath = {

    /**
     * Creates an instance of a 4x4 matrix filled with zeros
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
        matrix[12] = 0;
        matrix[13] = 0;
        matrix[14] = 0;
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
     * Multiplies two matrices
     * @param {ThreeDmalMath.Matrix} matrix1
     * @param {ThreeDmalMath.Matrix} matrix2
     * @return {ThreeDmalMath.Matrix}
     */
    multiply:function (matrix1, matrix2) {
        var matrix = new ThreeDmalMath.Matrix();
        matrix[0] = (((matrix1[0] * matrix2[0]) + (matrix1[1] * matrix2[4])) + (matrix1[2] * matrix2[8])) + (matrix1[3] * matrix2[12]);
        matrix[1] = (((matrix1[0] * matrix2[1]) + (matrix1[1] * matrix2[5])) + (matrix1[2] * matrix2[9])) + (matrix1[3] * matrix2[13]);
        matrix[2] = (((matrix1[0] * matrix2[2]) + (matrix1[1] * matrix2[6])) + (matrix1[2] * matrix2[10])) + (matrix1[3] * matrix2[14]);
        matrix[3] = (((matrix1[0] * matrix2[3]) + (matrix1[1] * matrix2[7])) + (matrix1[2] * matrix2[11])) + (matrix1[3] * matrix2[15]);
        matrix[4] = (((matrix1[4] * matrix2[0]) + (matrix1[5] * matrix2[4])) + (matrix1[6] * matrix2[8])) + (matrix1[7] * matrix2[12]);
        matrix[5] = (((matrix1[4] * matrix2[1]) + (matrix1[5] * matrix2[5])) + (matrix1[6] * matrix2[9])) + (matrix1[7] * matrix2[13]);
        matrix[6] = (((matrix1[4] * matrix2[2]) + (matrix1[5] * matrix2[6])) + (matrix1[6] * matrix2[10])) + (matrix1[7] * matrix2[14]);
        matrix[7] = (((matrix1[4] * matrix2[3]) + (matrix1[5] * matrix2[7])) + (matrix1[6] * matrix2[11])) + (matrix1[7] * matrix2[15]);
        matrix[8] = (((matrix1[8] * matrix2[0]) + (matrix1[9] * matrix2[4])) + (matrix1[10] * matrix2[8])) + (matrix1[11] * matrix2[12]);
        matrix[9] = (((matrix1[8] * matrix2[1]) + (matrix1[9] * matrix2[5])) + (matrix1[10] * matrix2[9])) + (matrix1[11] * matrix2[13]);
        matrix[10] = (((matrix1[8] * matrix2[2]) + (matrix1[9] * matrix2[6])) + (matrix1[10] * matrix2[10])) + (matrix1[11] * matrix2[14]);
        matrix[11] = (((matrix1[8] * matrix2[3]) + (matrix1[9] * matrix2[7])) + (matrix1[10] * matrix2[11])) + (matrix1[11] * matrix2[15]);
        matrix[12] = (((matrix1[12] * matrix2[0]) + (matrix1[13] * matrix2[4])) + (matrix1[14] * matrix2[8])) + (matrix1[15] * matrix2[12]);
        matrix[13] = (((matrix1[12] * matrix2[1]) + (matrix1[13] * matrix2[5])) + (matrix1[14] * matrix2[9])) + (matrix1[15] * matrix2[13]);
        matrix[14] = (((matrix1[12] * matrix2[2]) + (matrix1[13] * matrix2[6])) + (matrix1[14] * matrix2[10])) + (matrix1[15] * matrix2[14]);
        matrix[15] = (((matrix1[12] * matrix2[3]) + (matrix1[13] * matrix2[7])) + (matrix1[14] * matrix2[11])) + (matrix1[15] * matrix2[15]);

        return matrix;
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

    /**
     * Transforms a 4D point using a transformation matrix
     * @param {Array} vector
     * @param {ThreeDmalMath.Matrix} transformationMatrix
     * @return {Array}
     */
    transformVector4:function (vector, transformationMatrix) {
        var vx = vector[0],
            vy = vector[1],
            vz = vector[2],
            vw = vector[3],
            x = (((vx * transformationMatrix[0]) + (vy * transformationMatrix[4])) + (vz * transformationMatrix[8])) + (vw * transformationMatrix[12]),
            y = (((vx * transformationMatrix[1]) + (vy * transformationMatrix[5])) + (vz * transformationMatrix[9])) + (vw * transformationMatrix[13]),
            z = (((vx * transformationMatrix[2]) + (vy * transformationMatrix[6])) + (vz * transformationMatrix[10])) + (vw * transformationMatrix[14]),
            w = (((vx * transformationMatrix[3]) + (vy * transformationMatrix[7])) + (vz * transformationMatrix[11])) + (vw * transformationMatrix[15]);

        return [x, y, z, w];
    }

};
