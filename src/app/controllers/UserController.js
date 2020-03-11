import User from '../models/User';

class UserController {
  async store(req, res) {
    const userExists = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (userExists) {
      return res.status(400).json({
        error: 'User already exsists.',
      });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    const { email, oldPassword, password } = req.body;

    const user = await User.findByPk(req.userId);

    // Usuário ta querendo alterar o e-mail
    if (email !== user.email) {
      const userExists = await User.findOne({
        where: {
          email,
        },
      });

      if (userExists) {
        return res.status(400).json({
          error: 'User already exsists.',
        });
      }
    }

    // Caso queira alterar a senha, tanto a senha antiga,
    // quanto a nova, deverão ser fornecidas
    if (password) {
      if (!oldPassword) {
        return res.status(401).json({
          error: 'oldPassword not provided',
        });
      }
    }

    // Caso o usuário queira inserir uma nova senha
    // verifica se a senha antiga, bate com a atual
    // salva no banco de dados
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({
        error: 'Password does not match',
      });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      provider,
      email,
    });
  }
}

export default new UserController();
