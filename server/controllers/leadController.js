import Lead from '../models/Lead.js';
import Property from '../models/Property.js';

// @desc    Create lead
// @route   POST /api/leads
// @access  Public
export const createLead = async (req, res) => {
  try {
    const { property, phone, email, name, message, source } = req.body;

    // Validate required fields
    if (!property || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide property, phone, and email',
      });
    }

    // Check if property exists
    const propertyExists = await Property.findById(property);
    if (!propertyExists) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Create lead
    const lead = await Lead.create({
      property,
      phone,
      email,
      name,
      message,
      source: source || 'gallery',
    });

    // Populate property details
    await lead.populate('property', 'title city price type category');

    res.status(201).json({
      success: true,
      lead,
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get all leads (Admin)
// @route   GET /api/admin/leads
// @access  Private/Admin
export const getAllLeads = async (req, res) => {
  try {
    const {
      property,
      status,
      page = 1,
      limit = 20,
      sort = '-createdAt',
    } = req.query;

    const query = {};
    if (property) query.property = property;
    if (status) query.status = status;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const leads = await Lead.find(query)
      .populate('property', 'title city price type category images')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Lead.countDocuments(query);

    res.status(200).json({
      success: true,
      count: leads.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      leads,
    });
  } catch (error) {
    console.error('Get all leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get leads by property (Admin)
// @route   GET /api/admin/properties/:propertyId/leads
// @access  Private/Admin
export const getLeadsByProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { page = 1, limit = 20, sort = '-createdAt' } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const leads = await Lead.find({ property: propertyId })
      .populate('property', 'title city price type category')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Lead.countDocuments({ property: propertyId });

    res.status(200).json({
      success: true,
      count: leads.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      leads,
    });
  } catch (error) {
    console.error('Get leads by property error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update lead status (Admin)
// @route   PUT /api/admin/leads/:id
// @access  Private/Admin
export const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status',
      });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('property', 'title city price type category');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    res.status(200).json({
      success: true,
      lead,
    });
  } catch (error) {
    console.error('Update lead status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Delete lead (Admin)
// @route   DELETE /api/admin/leads/:id
// @access  Private/Admin
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    await lead.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get lead statistics (Admin)
// @route   GET /api/admin/leads/stats
// @access  Private/Admin
export const getLeadStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'new' });
    const contactedLeads = await Lead.countDocuments({ status: 'contacted' });
    const interestedLeads = await Lead.countDocuments({ status: 'interested' });
    const closedLeads = await Lead.countDocuments({ status: 'closed' });

    // Get leads by property
    const leadsByProperty = await Lead.aggregate([
      {
        $group: {
          _id: '$property',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'properties',
          localField: '_id',
          foreignField: '_id',
          as: 'property',
        },
      },
      {
        $unwind: '$property',
      },
      {
        $project: {
          propertyId: '$_id',
          propertyTitle: '$property.title',
          count: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total: totalLeads,
        new: newLeads,
        contacted: contactedLeads,
        interested: interestedLeads,
        closed: closedLeads,
        byProperty: leadsByProperty,
      },
    });
  } catch (error) {
    console.error('Get lead stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
