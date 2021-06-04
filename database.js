const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

/// Users
/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  const queryString = `SELECT id, name, email, password FROM users WHERE email = $1;`;
  return pool.query(queryString, [email]).then((result) => {
    return result.rows[0];
  });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const queryString = `INSERT INTO users (name, email, phone, password, photo_url, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *;`;
  return pool
    .query(queryString, [
      user.name,
      user.email,
      user.phone,
      user.password,
      "https://upload.wikimedia.org/wikipedia/commons/d/dd/Donut8.jpg",
    ])
    .then((result) => {
      return result.rows[0];
    });
};
exports.addUser = addUser;

// /// Reservations

// /**
//  * Get all reservations for a single user.
//  * @param {string} guest_id The id of the user.
//  * @return {Promise<[{}]>} A promise to the reservations.
//  */
// const getAllReservations = function(guest_id, limit = 10) {
//   const queryString = `SELECT properties.*, reservations.*, avg(rating) AS average_rating
//     FROM reservations
//     JOIN properties ON reservations.property_id = properties.id
//     JOIN property_reviews ON properties.id = property_reviews.property_id
//     WHERE reservations.guest_id = $1
//     AND reservations.end_date < now()::date
//     GROUP BY properties.id, reservations.id
//     ORDER BY reservations.start_date
//     LIMIT $2;`;
//   return pool.query(queryString, [guest_id, limit])
//   .then((result) => {
//     return result.rows;
//   });
// }
// exports.getAllReservations = getAllReservations;

// /// Properties

// /**
//  * Get all properties.
//  * @param {{}} options An object containing query options.
//  * @param {*} limit The number of results to return.
//  * @return {Promise<[{}]>}  A promise to the properties.
//  */
// const getAllProperties = function(options, limit = 10) {
//   const queryParams = [];
//   let queryString = `
//   SELECT properties.*, avg(property_reviews.rating) as average_rating
//   FROM properties
//   JOIN property_reviews ON properties.id = property_id
//   WHERE 1=1
//   `;

//   if (options.city) {
//     queryParams.push(`%${options.city}%`);
//     queryString += `AND city LIKE $${queryParams.length} `;
//   }

//   if (options.owner_id) {
//     queryParams.push(options.owner_id);
//     queryString += `AND owner_id = $${queryParams.length} `;
//   }

//   if (options.minimum_price_per_night && options.maximum_price_per_night) {
//     queryParams.push(options.minimum_price_per_night * 100);
//     queryString += `AND cost_per_night BETWEEN $${queryParams.length} `;
//     queryParams.push(options.maximum_price_per_night * 100);
//     queryString += `AND $${queryParams.length} `;
//   }

//   queryString += `GROUP BY properties.id `;

//   if (options.minimum_rating) {
//     queryParams.push(options.minimum_rating);
//     queryString += `HAVING avg(rating) >= $${queryParams.length} `;
//   }

//   queryParams.push(limit);
//   queryString += `ORDER BY cost_per_night
//   LIMIT $${queryParams.length};
//   `;

//   return pool.query(queryString, queryParams).then((res) => res.rows);
// }
// exports.getAllProperties = getAllProperties;

// /**
//  * Add a property to the database
//  * @param {{}} property An object containing all of the property details.
//  * @return {Promise<{}>} A promise to the property.
//  */
// const addProperty = function(property) {
//   const queryString = `INSERT INTO properties (owner_id,title,description,
//     thumbnail_photo_url,cover_photo_url,cost_per_night,parking_spaces,
//     number_of_bathrooms,number_of_bedrooms,country,street,city,province,post_code)
//     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *;`;
//     return pool.query(queryString, [property.owner_id,property.title,property.description,
//       property.thumbnail_photo_url,property.cover_photo_url,property.cost_per_night,
//       property.parking_spaces,property.number_of_bathrooms,property.number_of_bedrooms,
//       property.country,property.street,property.city,property.province,property.post_code])
//     .then((result) => {
//       return result.rows[0];
//     });
// }
// exports.addProperty = addProperty;
