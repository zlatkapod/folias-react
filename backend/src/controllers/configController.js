const { PlantType, SoilType, PotSize, LightCondition } = require('../models/Configuration');
const asyncHandler = require('../middleware/asyncHandler');

// Generic controller factory for configuration models
const createConfigController = (Model, modelName) => {
  return {
    // Get all items
    getAll: asyncHandler(async (req, res) => {
      const items = await Model.find();
      
      res.status(200).json({
        success: true,
        count: items.length,
        data: items
      });
    }),
    
    // Get single item
    getOne: asyncHandler(async (req, res) => {
      const item = await Model.findById(req.params.id);
      
      if (!item) {
        return res.status(404).json({
          success: false,
          message: `${modelName} with id ${req.params.id} not found`
        });
      }
      
      res.status(200).json({
        success: true,
        data: item
      });
    }),
    
    // Create new item
    create: asyncHandler(async (req, res) => {
      const item = await Model.create(req.body);
      
      res.status(201).json({
        success: true,
        data: item
      });
    }),
    
    // Update item
    update: asyncHandler(async (req, res) => {
      let item = await Model.findById(req.params.id);
      
      if (!item) {
        return res.status(404).json({
          success: false,
          message: `${modelName} with id ${req.params.id} not found`
        });
      }
      
      item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      
      res.status(200).json({
        success: true,
        data: item
      });
    }),
    
    // Delete item
    delete: asyncHandler(async (req, res) => {
      const item = await Model.findById(req.params.id);
      
      if (!item) {
        return res.status(404).json({
          success: false,
          message: `${modelName} with id ${req.params.id} not found`
        });
      }
      
      await item.deleteOne();
      
      res.status(200).json({
        success: true,
        data: {}
      });
    })
  };
};

// Create controllers for each configuration type
exports.plantType = createConfigController(PlantType, 'Plant Type');
exports.soilType = createConfigController(SoilType, 'Soil Type');
exports.potSize = createConfigController(PotSize, 'Pot Size');
exports.lightCondition = createConfigController(LightCondition, 'Light Condition'); 