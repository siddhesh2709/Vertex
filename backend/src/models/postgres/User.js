const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    firebaseUid: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING
    },
    photoURL: {
        type: DataTypes.STRING
    },
    location: {
        type: DataTypes.STRING // "lat,lng"
    },
    soilType: {
        type: DataTypes.STRING
    },
    farmSize: {
        type: DataTypes.FLOAT // in acres/hectares
    }
});

module.exports = User;
