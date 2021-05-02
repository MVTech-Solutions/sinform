const knex = require("../config/db");

module.exports = (app) => {
  const { existsOrError } = app.api.validator;

  const getById = async (req, res) => {
    try {
      existsOrError(req.params.id, "event não existe!");

      const getIdEvent = await knex("event")
        .where({ event_id: req.params.id })
        .first();
      existsOrError(getIdEvent, "event não encontrado");

      res.json(getIdEvent);
    } catch (msg) {
      return res.status(400).send(msg);
    }
  };

  return { getById};
};
