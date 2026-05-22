import { Request, Response } from 'express';
import Lead from '../models/Lead';
import Appointment from '../models/Appointment';

// @desc    Get dashboard analytics
// @route   GET /api/analytics
// @access  Private/Admin
export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const completedConsultations = await Appointment.countDocuments({ status: 'completed' });
    
    // Calculate simple mock monthly growth or satisfaction for now
    const satisfactionRate = 98; // This would normally come from a reviews table
    const monthlyGrowth = 34; // This would normally compare current month to last month

    // Leads over time (mocked aggregation for simplicity in example, but real logic would group by month)
    const leadsByMonth = await Lead.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Map month numbers to names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const leadsOverTime = leadsByMonth.map(item => ({
      date: monthNames[item._id - 1] || 'Unknown',
      count: item.count
    }));

    // If leadsOverTime is empty (no data), supply some zeros or mock for the UI
    if (leadsOverTime.length === 0) {
      leadsOverTime.push({ date: monthNames[new Date().getMonth()], count: 0 });
    }

    // Consultation Status Distribution
    const statuses = await Appointment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const consultationStatus = statuses.map(s => ({
      status: s._id.charAt(0).toUpperCase() + s._id.slice(1),
      count: s.count
    }));

    res.json({
      success: true,
      data: {
        totalLeads,
        completedConsultations,
        satisfactionRate,
        monthlyGrowth,
        leadsOverTime,
        consultationStatus,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
