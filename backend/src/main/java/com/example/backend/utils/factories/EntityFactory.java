package com.example.backend.utils.factories;

import com.example.backend.model.BaseModel;

interface EntityFactory {
    BaseModel createEntity();
}