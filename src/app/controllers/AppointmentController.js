import Appointment from '../models/Appointment';
import User from '../models/User';
import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import File from '../models/File';
import Notification from '../schemas/Notification';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const appointments = await Appointment.findAll({
      user_id: req.userId,
      canceled_at: null,
      order: ['date'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'url', 'path'],
            },
          ],
        },
      ],
      limit: 20,
      offset: (page - 1) * 20,
    });
    return res.json(appointments);
  }

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

    const { provider_id, date } = req.body;

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

    // Verifica datas passadas
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(401).json({
        error: 'Past dates are not permitted',
      });
    }

    // Verifica disponibilidade do provider
    const notAvailable = await Appointment.findOne({
      where: {
        provider_id,
        date: hourStart,
      },
    });

    if (notAvailable) {
      return res.status(401).json({
        error: 'Date not available',
      });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      ...req.body,
    });

    // Notifica provider
    const user = await User.findByPk(req.userId);
    const formattedDate = format(hourStart, "'dia' dd 'de' MMMM 'às' H:mm'h'", {
      locale: pt,
    });

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
