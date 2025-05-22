require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

//verifyingg the values
console.log("Supabase URL:", supabaseUrl ? "loaded" : "missing");
console.log("Supabase Key:", supabaseKey ? "loaded" : "missing");

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
