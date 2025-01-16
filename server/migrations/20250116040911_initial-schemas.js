exports.up = function(knex) {
    return knex.schema
        // Workspace Table
        .createTable('workspace', table => {
            table.string('id').primary();
            table.string('name').notNullable();
            table.string('description');
            table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
        })

        // User Table
        .createTable('user', table => {
            table.string('id').primary();
            table.string('name').notNullable();
            table.string('email').notNullable();
            table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
        })

        // User_Workspace Table
        .createTable('user_workspace', table => {
            table.string('id').primary();
            table.string('workspace_id').notNullable().references('id').inTable('workspace').onDelete('CASCADE');
            table.string('user_id').notNullable().references('id').inTable('user').onDelete('CASCADE');
            table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
        })

        // Project Table
        .createTable('project', table => {
            table.string('id').primary();
            table.string('name').notNullable();
            table.string('description');
            table.datetime('started_at');
            table.datetime('target_date');
            table.datetime('finished_at');
            table.string('workspace_id').notNullable().references('id').inTable('workspace').onDelete('CASCADE');
            table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
        })

        // Task Group Table
        .createTable('task_group', table => {
            table.string('id').primary();
            table.integer('order').notNullable();
            table.string('name').notNullable();
            table.string('project_id').notNullable().references('id').inTable('project').onDelete('CASCADE');
            table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
        })

        // Task Table
        .createTable('task', table => {
            table.string('id').primary();
            table.string('name').notNullable();
            table.string('description');
            table.enum('priority', ['low', 'medium', 'high']);
            table.datetime('due_date');
            table.string('project_id').notNullable().references('id').inTable('project').onDelete('CASCADE');
            table.string('workspace_id').notNullable().references('id').inTable('workspace').onDelete('CASCADE');
            table.string('assignee_id').references('id').inTable('user').onDelete('SET NULL');
            table.string('task_group_id').notNullable().references('id').inTable('task_group').onDelete('CASCADE');
            table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
        })

        // Comment Table
        .createTable('comment', table => {
            table.string('id').primary();
            table.string('text').notNullable();
            table.string('task_id').notNullable().references('id').inTable('task').onDelete('CASCADE');
            table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
        })

        // Tag Table
        .createTable('tag', table => {
            table.string('id').primary();
            table.string('name').notNullable();
            table.string('workspace_id').notNullable().references('id').inTable('workspace').onDelete('CASCADE');
            table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
        })

        // Task_Tag Table
        .createTable('task_tag', table => {
            table.string('id').primary();
            table.string('task_id').notNullable().references('id').inTable('task').onDelete('CASCADE');
            table.string('tag_id').notNullable().references('id').inTable('tag').onDelete('CASCADE');
            table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('task_tag')
        .dropTableIfExists('tag')
        .dropTableIfExists('comment')
        .dropTableIfExists('task')
        .dropTableIfExists('task_group')
        .dropTableIfExists('project')
        .dropTableIfExists('user_workspace')
        .dropTableIfExists('user')
        .dropTableIfExists('workspace');
};
