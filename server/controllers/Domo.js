const models = require('../models');

const { Domo } = models;

const makerPage = async (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.coolness) {
    return res.status(400).json({ error: 'All fields are requiered!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    coolness: req.body.coolness,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    newDomo.save();
    return res.status(201).json({
      name: newDomo.name,
      age: newDomo.age,
      coolness: newDomo.coolness,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making the domo' });
  }
};

const getDomos = async (req, res) => {
  try {
    // Find every domo owned by the current session owner and grab their names, ages, and coolness
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age coolness').lean().exec();

    // Send back the now compiled list of domos
    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving Domos!' });
  }
};

module.exports = {
  makeDomo,
  makerPage,
  getDomos,
};
