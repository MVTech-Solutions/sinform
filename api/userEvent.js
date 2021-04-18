const knex = require("../config/db");
const user = require("./user");

module.exports = (app) => {
  const { existsOrError } = app.api.validator;

  const get = async (req, res) => {
    const userEvent = await knex("userEvent").select("*");
    return res.json(userEvent);
  };

  const getByUserId = async (req, res) => {
    try {
      console.log(req.params.id)
      existsOrError(req.params.id, "userEvent does not exist!");

      const getIdUserEvent = await knex("userEvent")
        .where({ user_id: req.params.id })
      /* existsOrError(getIdUserEvent, "user not found"); */

      res.json(getIdUserEvent);
    } catch (msg) {
      return res.status(400).send(msg);
    }
  };

  const remove = async (req, res) => {
    try {
      existsOrError(req.query.user_id, "event does not exist!");
      existsOrError(req.query.event_id, "user does not exist!");

      const removeUserEvent = await knex("userEvent")
        .del()
        .where({ event_id: req.query.event_id, user_id: req.query.user_id });
      existsOrError(removeUserEvent, "userEvent not found");

      res.status(204).send();
    } catch (msg) {
      return res.status(400).send(msg);
    }
  };

  const post = async (req, res) => {
    const userEvent = req.body;
    const userEvent_presence = false;

    const user_id = userEvent.user_id;
    const event_id = userEvent.event_id;
    const event_day = userEvent.event_day;

    const checkConflict = await knex('userEvent').innerJoin('event', 'userEvent.event_id', 'event.event_id')
      .where({user_id, event_date: event_day, event_type: 1})

    console.log(checkConflict)
    if(checkConflict.length > 0) return res.status(400).send({error: true, msg: "Conflito de horário!"})

    const typeEventFromDB = await knex("event")
      .where({event_id: event_id})
      .first();

    const sizeOfEvent = await knex("userEvent")
      .where({event_id: event_id})

    const verify = await knex("userEvent")
      .where({ event_id: event_id, user_id: user_id})

    if(verify.length == 0){
      if(typeEventFromDB.event_type){
        if(sizeOfEvent.length <= 40){
          try {
            const newUserEvent = await knex("userEvent").insert({
              user_id,
              event_id,
              userEvent_presence,
            });
            res.json(newUserEvent);
          } catch (err) {
            console.log(err);
            return res.status(500).send(err);
          }
        } else {
          return res.status(500).json("Numero maximo de participantes atingido");
        }
      } else {
        try {
          const newUserEvent = await knex("userEvent").insert({
            user_id,
            event_id,
            userEvent_presence,
          });
          res.json(newUserEvent);
        } catch (err) {
          console.log(err);
          return res.status(500).send(err);
        }
      }
    } else {
      return res.status(500).json("Usuario já cadastrado em evento")
    }    
  };

  const put = async (req, res) => {
    const user_id = req.query.user_id;
    const event_id = req.query.event_id;
    const userEvent_presence = true;
    try {
      const modifiedUserEvent = await knex("userEvent").where({
        user_id: user_id,
        event_id: event_id,
      }).first()
      if(modifiedUserEvent.userEvent_presence){
        return res.status(400).send({error: true, msg: "Presença já cadastrada!"})
      }
      const certificateFromDatabase = await knex("certificate")
        .where({ user_id:  user_id})
        .first()

      if (modifiedUserEvent) {
        const event = await knex("event").where({
          event_id: event_id,
        }).first();

        certificateFromDatabase.certificate_participationTime = parseInt(certificateFromDatabase.certificate_participationTime) + parseInt(event.event_workload);
      } else { 
          return res.status(400).send({error: true, msg: 'Erro na requisição'})
      }

      const attUserEvent = await knex("userEvent")
        .update({userEvent_presence})
        .where({ user_id: user_id, event_id: event_id });
      existsOrError(attUserEvent, "userEvent not found");

      const attCertificate = await knex("certificate")
        .update({certificate_participationTime: certificateFromDatabase.certificate_participationTime})
        .where({ user_id: user_id });
      existsOrError(attCertificate, "userEvent not found");

      res.status(200).send();
    } catch (msg) {
        console.log(msg)
      return res.status(400).send(msg);
    }
  };

  return { get, getByUserId, post, put, remove };
};
