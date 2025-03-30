import Bank from "../models/bank.model.js";
import BankRequest from "../models/bankrequest.model.js";

//request related to banks that the user makes
export const createBankRequest = async (req, res) => {
  try {
    const { bank, bloodgroup, quantity, location } = req.body;

    const bankDoc = await Bank.findOne({ name: bank });

    if (!bankDoc) {
      return res.status(404).json({ message: "Bank not found" });
    }

    const newBankRequest = await BankRequest.create({
      bank: bankDoc._id,
      bloodgroup,
      quantity,
      location,
      user: req.user._id,
    });

    res
      .status(200)
      .json({ message: "Bank request created successfully", newBankRequest });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create bank request", error: error.message });
  }
};

//admin handles these parts
export const getAllBankRequests = async (req, res) => {
  try {
    const requests = await BankRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch bank requests", error: error.message });
  }
};

export const getAllBankData = async (req, res) => {
  try {
    const bankData = await Bank.find();
    res.status(200).json(bankData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch bank data", error: error.message });
  }
};

export const updateBankDetails = async (req, res) => {
  try {
    const { bankid } = req.params;

    const { name, bloodInventory, location } = req.body;
    const updatedBank = await Bank.findByIdAndUpdate(
      bankid,
      {
        name,
        bloodInventory,
        location,
      },
      {
        new: true,
      }
    );

    if (!updatedBank) {
      return res.status(404).json({ message: "Bank not found" });
    }
    res.status(200).json({ message: "Bank updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update bank", error: error.message });
  }
};

export const processBankrequest = async (req, res) => {
  try {
    const { requestid } = req.params;

    const { action } = req.body;

    const request = await BankRequest.findById(requestid);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "request already processed" });
    }

    if (action === "accepted") {
      const bank = await Bank.findById(request.bank);

      if (!bank) {
        return res.status(404).json({ message: "Bank not found" });
      }

      const bloodGroupMap = {
        "A+": "A_positive",
        "A-": "A_negative",
        "B+": "B_positive",
        "B-": "B_negative",
        "AB+": "AB_positive",
        "AB-": "AB_negative",
        "O+": "O_positive",
        "O-": "O_negative",
      };

      const key = bloodGroupMap[request.bloodgroup];

      if (!key) {
        return res.status(400).json({ message: "Invalid blood group" });
      }

      if (bank.bloodInventory[key] < request.quantity) {
        return res
          .status(400)
          .json({ message: "Insufficient blood inventory for the request" });
      }

      bank.bloodInventory[key] -= request.quantity;

      await bank.save();

      await BankRequest.findByIdAndDelete(requestid);

      return res.status(200).json({
        message: "Request processed successfully and inventory updated",
      });
    } else if (action === "rejected") {
      await BankRequest.findByIdAndDelete(requestid);
      return res.status(200).json({ message: "Request rejected successfully" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to process request", error: error.message });
  }
};
