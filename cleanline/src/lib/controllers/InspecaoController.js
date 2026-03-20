const pool = require('../db/connection');

class InspecaoController {
  // Método para criar uma nova inspeção
  static async createInspecao(data) {
    try {
      const { setor_id, user_id, itens_5s } = data;
      const query = `
        INSERT INTO inspecoes (setor_id, user_id, itens_5s, data_inspecao)
        VALUES (?, ?, ?, NOW())
      `;
      const [result] = await pool.execute(query, [setor_id, user_id, JSON.stringify(itens_5s)]);
      return result.insertId;
    } catch (error) {
      throw new Error('Erro ao criar inspeção: ' + error.message);
    }
  }

  // Método para obter inspeções por setor
  static async getInspecoesBySetor(setor_id) {
    try {
      const query = 'SELECT * FROM inspecoes WHERE setor_id = ? ORDER BY data_inspecao DESC';
      const [rows] = await pool.execute(query, [setor_id]);
      return rows;
    } catch (error) {
      throw new Error('Erro ao buscar inspeções: ' + error.message);
    }
  }

  // Método para obter todas as inspeções
  static async getAllInspecoes() {
    try {
      const query = 'SELECT * FROM inspecoes ORDER BY data_inspecao DESC';
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      throw new Error('Erro ao buscar inspeções: ' + error.message);
    }
  }
}

module.exports = InspecaoController;