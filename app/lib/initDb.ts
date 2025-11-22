import sql from "./db";
function initDb(){
    sql`CREATE TABLE IF NOT EXISTS urls (code VARCHAR(8) PRIMARY KEY,
    target TEXT NOT NULL,
    clicks INT NOT NULL DEFAULT 0,
    last_clicked TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW())`;
}

initDb()