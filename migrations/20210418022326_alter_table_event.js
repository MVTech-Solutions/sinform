
exports.up = function(knex) {
    return knex.schema.raw("ALTER TABLE `event` ADD event_date VARCHAR(10)")
};

exports.down = function(knex) {
    return knex.schema.raw("ALTER TABLE `event` DROP event_date")
};
