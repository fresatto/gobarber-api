import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    //   Verifica se o usuário que está requisitando é um provider
    const provider = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });

    if (!provider) {
      return res.status(401).json({
        error: 'Only providers can load notifications',
      });
    }

    const notifications = await Notification.find({
      user: req.userId,
    }).sort({ createdAt: 'desc' });

    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        read: true,
      },
      // Esse segundo objeto é necessário para que a notificacao
      // seja retornada
      { new: true }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
