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
     * Constan Epsilon
     * @type {Number}
     */
    EPSILON:1.401298E-45,

    /**
     * Create an instance of a 4x4 Matrix
     * @return {ThreeDmal.Matrix}
     * @this {ThreeDmal.Matrix}
     * @constructor
     */
    Matrix:function () {
        var that = this;
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

        /**
         * Inverts the Matrix
         * @this {ThreeDmal.Matrix}
         */
        this.invert = function () {
            var num5 = that[0];
            var num4 = that[1];
            var num3 = that[2];
            var num2 = that[3];
            var num9 = that[4];
            var num8 = that[5];
            var num7 = that[6];
            var num6 = that[7];
            var num17 = that[8];
            var num16 = that[9];
            var num15 = that[10];
            var num14 = that[11];
            var num13 = that[12];
            var num12 = that[13];
            var num11 = that[14];
            var num10 = that[15];
            var num23 = (num15 * num10) - (num14 * num11);
            var num22 = (num16 * num10) - (num14 * num12);
            var num21 = (num16 * num11) - (num15 * num12);
            var num20 = (num17 * num10) - (num14 * num13);
            var num19 = (num17 * num11) - (num15 * num13);
            var num18 = (num17 * num12) - (num16 * num13);
            var num39 = ((num8 * num23) - (num7 * num22)) + (num6 * num21);
            var num38 = -(((num9 * num23) - (num7 * num20)) + (num6 * num19));
            var num37 = ((num9 * num22) - (num8 * num20)) + (num6 * num18);
            var num36 = -(((num9 * num21) - (num8 * num19)) + (num7 * num18));
            var num = 1 / ((((num5 * num39) + (num4 * num38)) + (num3 * num37)) + (num2 * num36));
            that[0] = num39 * num;
            that[4] = num38 * num;
            that[8] = num37 * num;
            that[12] = num36 * num;
            that[1] = -(((num4 * num23) - (num3 * num22)) + (num2 * num21)) * num;
            that[5] = (((num5 * num23) - (num3 * num20)) + (num2 * num19)) * num;
            that[9] = -(((num5 * num22) - (num4 * num20)) + (num2 * num18)) * num;
            that[13] = (((num5 * num21) - (num4 * num19)) + (num3 * num18)) * num;
            var num35 = (num7 * num10) - (num6 * num11);
            var num34 = (num8 * num10) - (num6 * num12);
            var num33 = (num8 * num11) - (num7 * num12);
            var num32 = (num9 * num10) - (num6 * num13);
            var num31 = (num9 * num11) - (num7 * num13);
            var num30 = (num9 * num12) - (num8 * num13);
            that[2] = (((num4 * num35) - (num3 * num34)) + (num2 * num33)) * num;
            that[6] = -(((num5 * num35) - (num3 * num32)) + (num2 * num31)) * num;
            that[10] = (((num5 * num34) - (num4 * num32)) + (num2 * num30)) * num;
            that[14] = -(((num5 * num33) - (num4 * num31)) + (num3 * num30)) * num;
            var num29 = (num7 * num14) - (num6 * num15);
            var num28 = (num8 * num14) - (num6 * num16);
            var num27 = (num8 * num15) - (num7 * num16);
            var num26 = (num9 * num14) - (num6 * num17);
            var num25 = (num9 * num15) - (num7 * num17);
            var num24 = (num9 * num16) - (num8 * num17);
            that[3] = -(((num4 * num29) - (num3 * num28)) + (num2 * num27)) * num;
            that[7] = (((num5 * num29) - (num3 * num26)) + (num2 * num25)) * num;
            that[11] = -(((num5 * num28) - (num4 * num26)) + (num2 * num24)) * num;
            that[15] = (((num5 * num27) - (num4 * num25)) + (num3 * num24)) * num;
        };

        return this;
    },

    /**
     * Creates a 4x4 Identity Matrix
     * @constructor
     * @return {ThreeDmal.Matrix}
     */
    MatrixIdentity:function () {
        var matrix = new ThreeDmal.Matrix();
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
     * Creates a 4x4 Translation Matrix
     * @param {Array} vector3 The new position
     * @constructor
     * @return {ThreeDmal.Matrix}
     */
    createTranslation:function (vector3) {
        var matrix = new ThreeDmal.Matrix();
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
     * Creates a 4x4 Scale Matrix
     * @param {number} xScale The scale in x-axis
     * @param {number} yScale The scale in y-axis
     * @param {number} zScale The scale in z-axis
     * @constructor
     * @return {ThreeDmal.Matrix}
     */
    createScale:function (xScale, yScale, zScale) {
        var matrix = new ThreeDmal.Matrix();
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
     * Generates a Perspective Field Of View Matrix
     * @param {Number} fieldOfView
     * @param {Number} aspectRatio
     * @param {Number} nearPlaneDistance
     * @param {Number} farPlaneDistance
     * @constructor
     * @return {ThreeDmal.Matrix}
     */
    createPerspectiveFieldOfView:function (fieldOfView, aspectRatio, nearPlaneDistance, farPlaneDistance) {
        var matrix = new ThreeDmal.Matrix();
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
     * Creates a View Matrix for the scene
     * @param {Array} cameraPosition Array with the camera position
     * @param {Array} cameraTarget Array with the target position
     * @param {Array} cameraUpVector Array with the camera's vector up
     * @return {ThreeDmal.Matrix}
     */
    createLookAt:function (cameraPosition, cameraTarget, cameraUpVector) {
        var matrix = new ThreeDmal.Matrix();
        var vector = ThreeDmal.substractV3(cameraPosition, cameraTarget);
        ThreeDmal.normalize(vector);
        var vector2 = ThreeDmal.crossV3(cameraUpVector, vector);
        ThreeDmal.normalize(vector2);
        var vector3 = ThreeDmal.crossV3(vector, vector2);

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
        matrix[12] = -ThreeDmal.dotV3(vector2, cameraPosition);
        matrix[13] = -ThreeDmal.dotV3(vector3, cameraPosition);
        matrix[14] = -ThreeDmal.dotV3(vector, cameraPosition);
        matrix[15] = 1;
        return matrix;
    },

    /**
     * Multiplies two 4x4 Matrix
     * @param {ThreeDmal.Matrix} matrix1 4x4 Matrix
     * @param {ThreeDmal.Matrix} matrix2 4x4 Matrix
     * @return {ThreeDmal.Matrix}
     */
    multiply:function (matrix1, matrix2) {
        var matrix = new ThreeDmal.Matrix();
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
     * Converts a 3D point in a projected 2D point
     * @param {Array} pos 3D point to Convert.
     * @param {ThreeDmal.Matrix} worldviewproj World view projection matrix
     * @param {number} screenWidth Screen width
     * @param {number} screenHeight Screen Height
     * @return {Array}
     */
    convert:function (pos, worldviewproj, screenWidth, screenHeight) {
        var vx = pos[0],
            vy = pos[1],
            vz = pos[2],
            vw = pos[3],
            x1 = (((vx * worldviewproj[0]) + (vy * worldviewproj[4])) + (vz * worldviewproj[8])) + (vw * worldviewproj[12]),
            y1 = (((vx * worldviewproj[1]) + (vy * worldviewproj[5])) + (vz * worldviewproj[9])) + (vw * worldviewproj[13]),
            z1 = (((vx * worldviewproj[2]) + (vy * worldviewproj[6])) + (vz * worldviewproj[10])) + (vw * worldviewproj[14]),
            w1 = (((vx * worldviewproj[3]) + (vy * worldviewproj[7])) + (vz * worldviewproj[11])) + (vw * worldviewproj[15]),
            position = [x1, y1, z1, w1],
            x = position[0],
            y = position[1],
            w = position[2];
        return [screenWidth * ((x / w) + 1.0) / 2.0, screenHeight * (1.0 - (((y / w) + 1.0) / 2.0))];
    },

    /**
     * Normalizes a vector
     */
    normalize:function (vector) {
        if (vector.length === 2) {
            ThreeDmal.normalizeVector2(vector);
        }
        else if (vector.length === 3) {
            ThreeDmal.normalizeVector3(vector);
        }
        else if (vector.length === 4) {
            ThreeDmal.normalizeVector4(vector);
        }
    },

    /**
     * Normalizes a 2D vector
     * @param {Array} value
     */
    normalizeVector2:function (value) {
        var num2 = (value[0] * value[0]) + (value[1] * value[1]),
            num = 1 / (Math.sqrt(num2));
        value[0] *= num;
        value[1] *= num;
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
     * Normalizes a 4D vector
     * @param {Array} value
     */
    normalizeVector4:function (value) {
        var x = value[0],
            y = value[1],
            z = value[2],
            w = value[3],
            num2 = ((x * x) + (y * y)) + (z * z) + (w * w),
            num = 1 / Math.sqrt(num2);

        value[0] = x * num;
        value[1] = y * num;
        value[2] = z * num;
        value[3] = w * num;
    },

    /**
     * Inverts a 3D vector
     * @this {Array};
     */
    invert:function (vector3) {
        vector3[0] = -vector3[0];
        vector3[1] = -vector3[1];
        vector3[2] = -vector3[2];
    },

    /**
     * Divides each element of the 4D vector by divider
     * @param {Array} vector4
     * @param {number} divider
     * @this {Array}
     */
    divide:function (vector4, divider) {
        var num = 1 / divider;
        vector4[0] = vector4[0] * num;
        vector4[1] = vector4[1] * num;
        vector4[2] = vector4[2] * num;
        vector4[3] = vector4[3] * num;
    },

    /**
     * Substracts two 3D vectors
     * @param {Array} vector1 3D vector
     * @param {Array} vector2 3D vector
     * @return {Array}
     * @constructor
     */
    substractV3:function (vector1, vector2) {
        return [vector1[0] - vector2[0],
            vector1[1] - vector2[1],
            vector1[2] - vector2[2]];
    },

    /**
     * Cross product of two 3D vectors
     * @param {Array} vector1
     * @param {Array} vector2
     * @return {Array}
     */
    crossV3:function (vector1, vector2) {
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
    dotV3:function (vector1, vector2) {
        return (vector1[0] * vector2[0]) +
            (vector1[1] * vector2[1]) +
            (vector1[2] * vector2[2]);
    },

    /**
     * Transforms a 3D point using a Transformation Matrix
     * @param {Array} position Point Position
     * @param {ThreeDmal.Matrix} matrix Transformation Matrix
     * @return {Array}
     */
    transformV3Matrix:function (position, matrix) {
        var x = position[0],
            y = position[1],
            z = position[2],
            num3 = (((x * matrix[0]) + (y * matrix[4])) + (z * matrix[8])) + matrix[12],
            num2 = (((x * matrix[1]) + (y * matrix[5])) + (z * matrix[9])) + matrix[13],
            num = (((x * matrix[2]) + (y * matrix[6])) + (z * matrix[10])) + matrix[14];
        return [num3, num2, num];
    },

    /**
     * Transforms a 4D point using a Transformation Matrix
     * @param {Array} vector 4D vector
     * @param {ThreeDmal.Matrix} matrix Transformation Matrix
     * @return {Array}
     */
    transformV4Matrix:function (vector, matrix) {
        var vx = vector[0],
            vy = vector[1],
            vz = vector[2],
            vw = vector[3],
            x = (((vx * matrix[0]) + (vy * matrix[4])) + (vz * matrix[8])) + (vw * matrix[12]),
            y = (((vx * matrix[1]) + (vy * matrix[5])) + (vz * matrix[9])) + (vw * matrix[13]),
            z = (((vx * matrix[2]) + (vy * matrix[6])) + (vz * matrix[10])) + (vw * matrix[14]),
            w = (((vx * matrix[3]) + (vy * matrix[7])) + (vz * matrix[11])) + (vw * matrix[15]);
        return [x, y, z, w];
    },

    /**
     * Calculates the max vector of two vectors (combination of each coordinate)
     * @param {Array} value1 4D vector
     * @param {Array} value2 4D vector
     * @return {Array}
     */
    max:function (value1, value2) {
        return [(value1[0] > value2[0]) ? value1[0] : value2[0],
            (value1[1] > value2[1]) ? value1[1] : value2[1],
            (value1[2] > value2[2]) ? value1[2] : value2[2],
            (value1[3] > value2[3]) ? value1[3] : value2[3]];
    },

    /**
     * Calculates the min vector of two vectors (combination of each coordinate)
     * @param {Array} value1 4D vector
     * @param {Array} value2 4D vector
     * @return {Array}
     */
    min:function (value1, value2) {
        return [(value1[0] < value2[0]) ? value1[0] : value2[0],
            (value1[1] < value2[1]) ? value1[1] : value2[1],
            (value1[2] < value2[2]) ? value1[2] : value2[2],
            (value1[3] < value2[3]) ? value1[3] : value2[3]];
    },

    /**
     * Substracts two 4D vectors
     * @param {Array} value1 4D vector
     * @param {Array} value2 4D vector
     * @return {Array}
     */
    substractV4:function (value1, value2) {
        return [value1[0] - value2[0],
            value1[1] - value2[1],
            value1[2] - value2[2],
            value1[3] - value2[3]];
    },

    /**
     * Creates the rotation matrix from Yaw, Pitch and Roll
     * @param {number} yaw
     * @param {number} pitch
     * @param {number} roll
     * @return {ThreeDmal.Matrix}
     */
    createFromYawPitchRoll:function (yaw, pitch, roll) {
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

        var matrix = new ThreeDmal.Matrix();
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
        this.view = ThreeDmal.createLookAt(this.cameraPosition, this.cameraTarget, this.cameraUpVector);
        this.projection = ThreeDmal.createPerspectiveFieldOfView(Math.PI / 4, this.aspectRatio, 1, 1000);
        this.viewproj = ThreeDmal.multiply(this.view, this.projection);

        /**
         * Get the camera position
         * @return {Array}
         */
        this.getPosition = function () {
            return that.cameraPosition;
        };

        /**
         * Changes the Perspective Field Of View
         * @param {Number} fieldOfView the new fov
         * @param {Number} aspectRatio the new aspectratio
         * @param {Number} nearPlaneDistance the new Near Plane Distance
         * @param {Number} farPlaneDistance the new Far Plane Distance
         */
        this.changePerspectiveFieldOfView = function (fieldOfView, aspectRatio, nearPlaneDistance, farPlaneDistance) {
            that.projection = ThreeDmal.createPerspectiveFieldOfView(fieldOfView, aspectRatio, nearPlaneDistance, farPlaneDistance);
            that.viewproj = ThreeDmal.multiply(that.view, that.projection);
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
            that.view = ThreeDmal.createLookAt(that.cameraPosition, that.cameraTarget, that.cameraUpVector);
            that.viewproj = ThreeDmal.multiply(that.view, that.projection);
        };

        /**
         * Calculates if a value is into epsilon range
         * @param {Number} a
         * @param {Number} b
         * @return {Boolean}
         */
        this.withinEpsilon = function (a, b) {
            var num = a - b;
            return (-ThreeDmal.EPSILON <= num) && (num <= ThreeDmal.EPSILON);
        };
    },

    /**
     * Represents a 3D point in a 4D vector
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @constructor
     */
    Point3D:function (x, y, z) {
        this[0] = x;
        this[1] = y;
        this[2] = z;
        this[3] = 1;
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
        this.poligons = new Array();
        this.position = [0, 0, 0];
        this.rotation = [0, 0, 0];
        this.scale = [1, 1, 1];
        this.backfaceCulling = true;
        this.world = new ThreeDmal.MatrixIdentity();
        this.refreshedBoudingBox = false;

        /**
         * Adds a new vertex to the model
         * @param {Number} x
         * @param {Number} y
         * @param {Number} z
         * @return {Number}
         */
        this.addVertex = function (x, y, z) {
            var position = that.vertices.length;
            that.vertices[position] = new ThreeDmal.Point3D(x, y, z);
            return position;
        };

        /**
         * Adds a new triangle to the model
         * @param {Number} p1 Verex position
         * @param {Number} p2 Verex position
         * @param {Number} p3 Verex position
         */
        this.addTriangle = function (p1, p2, p3) {
            var position = that.index.length;
            that.index[position] = p1;
            that.index[position + 1] = p2;
            that.index[position + 2] = p3;
        };

        /**
         * Adds a new polygon to the model
         * @param {Array} polygon Array whith all vertexs position
         */
        this.addPolygon = function (polygon) {
            var position = that.poligons.length,
                vertices = [],
                l = polygon.length;
            for (var i = 0; i < l; i++) {
                vertices[i] = polygon[i];
            }
            that.poligons[position] = vertices;
        };

        /**
         * Updates the world matrix
         */
        this.refreshWorld = function () {
            var rotationMatrix = ThreeDmal.createFromYawPitchRoll(that.rotation[1], that.rotation[0], that.rotation[2]),
                scaleMatrix = ThreeDmal.createScale(that.scale[0], that.scale[1], that.scale[2]),
                translationMatrix = ThreeDmal.createTranslation(that.position);
            that.world = ThreeDmal.multiply(scaleMatrix, translationMatrix);
            that.world = ThreeDmal.multiply(rotationMatrix, that.world);
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
                    vertices[j] = ThreeDmal.transformV4Matrix(model.vertices[j], model.world);
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
                    v1 = ThreeDmal.substractV3(p1, p2),
                    v2 = ThreeDmal.substractV3(p3, p2),
                    n = ThreeDmal.crossV3(v1, v2),
                    c = ThreeDmal.substractV3(pc, p1),
                    tita = ThreeDmal.dotV3(c, n);

                if (!model.backfaceCulling || tita < 0) {
                    var vertex1 = ThreeDmal.convert(p1, that.camera.viewproj, that.width, that.height);
                    var vertex2 = ThreeDmal.convert(p2, that.camera.viewproj, that.width, that.height);
                    var vertex3 = ThreeDmal.convert(p3, that.camera.viewproj, that.width, that.height);
                    that.context.moveTo(vertex1[0], vertex1[1]);
                    that.context.lineTo(vertex2[0], vertex2[1]);
                    that.context.lineTo(vertex3[0], vertex3[1]);
                    that.context.lineTo(vertex1[0], vertex1[1]);
                }
            }

            var polygons = model.poligons;

            for (var i = 0; i < polygons.length; i++) {
                var polygon = polygons[i],
                    index = 0,
                    p1 = vertices[polygon[index]],
                    p2 = vertices[polygon[index + 1]],
                    p3 = vertices[polygon[index + 2]],
                    v1 = ThreeDmal.substractV3(p1, p2),
                    v2 = ThreeDmal.substractV3(p3, p2),
                    n = ThreeDmal.crossV3(v1, v2),
                    c = ThreeDmal.substractV3(pc, p1),
                    tita = ThreeDmal.dotV3(c, n);

                if (!model.backfaceCulling || tita < 0) {
                    var orig = ThreeDmal.convert(vertices[polygon[0]], that.camera.viewproj, that.width, that.height);
                    that.context.moveTo(orig[0], orig[1]);
                    var ll = polygon.length;

                    for (var j = 1; j < ll; j++) {
                        var aux = ThreeDmal.convert(vertices[polygon[j]], that.camera.viewproj, that.width, that.height);
                        that.context.lineTo(aux[0], aux[1]);
                    }

                    that.context.lineTo(orig[0], orig[1]);
                }
            }

            that.context.stroke();
        };
    }
};