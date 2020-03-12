import Appointment from '../models/Appointment';
import User from '../models/User';
import * as Yup from 'yup';

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    // Usuário não pode marcar com ele mesmo
    if (req.body.provider_id == req.userId) {
      return res.status(401).json({
        error: "You can't set a appointment with yourself.",
      });
    }

    // Verifica se o usuario é um provider
    const isProvider = await User.findOne({
      where: {
        id: req.body.provider_id,
        provider: true,
      },
    });

    if (!isProvider) {
      return res.status(401).json({
        error: 'User is not a provider',
      });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      ...req.body,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
