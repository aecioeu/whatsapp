-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           5.7.33 - MySQL Community Server (GPL)
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              11.2.0.6213
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para rifa
CREATE DATABASE IF NOT EXISTS `pesquisa` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `pesquisa`;

-- Copiando estrutura para tabela rifa.leads
CREATE TABLE IF NOT EXISTS `leads` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(5) NOT NULL DEFAULT '0',
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(60) DEFAULT NULL,
  `user` varchar(30) DEFAULT NULL,
  `_serialized` varchar(30) NOT NULL DEFAULT '0',
  `prize_uuid` varchar(30) DEFAULT '0',
  `stage` varchar(2) DEFAULT '0',
  `level` varchar(30) DEFAULT '0',
  `reference` varchar(5) DEFAULT '0',
  `conversion_type` varchar(20) DEFAULT 'PAGINA_CAPTURA',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=46 DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

-- Copiando dados para a tabela rifa.leads: 1 rows
/*!40000 ALTER TABLE `leads` DISABLE KEYS */;
REPLACE INTO `leads` (`id`, `uuid`, `created`, `name`, `user`, `_serialized`, `prize_uuid`, `stage`, `level`, `reference`, `conversion_type`) VALUES
	(45, 'MOHI4', '2021-12-24 08:44:17', 'Aécio Oliveira', '553788555554', '553788555554@s.whatsapp.net', 'ABC123', '5', '0', '0', 'BOT');
/*!40000 ALTER TABLE `leads` ENABLE KEYS */;

-- Copiando estrutura para tabela rifa.luck_numbers
CREATE TABLE IF NOT EXISTS `luck_numbers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lead_id` varchar(10) DEFAULT NULL,
  `prize_id` varchar(10) DEFAULT NULL,
  `lucknumber` varchar(10) DEFAULT NULL,
  `active` char(50) DEFAULT 'INACTIVE',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=192 DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela rifa.luck_numbers: ~80 rows (aproximadamente)
/*!40000 ALTER TABLE `luck_numbers` DISABLE KEYS */;
REPLACE INTO `luck_numbers` (`id`, `lead_id`, `prize_id`, `lucknumber`, `active`) VALUES
	(112, '45', 'ABC123', '144', 'INACTIVE'),
	(113, '45', 'ABC123', '467', 'INACTIVE'),
	(114, '45', 'ABC123', '381', 'INACTIVE'),
	(115, '45', 'ABC123', '226', 'INACTIVE'),
	(116, '45', 'ABC123', '124', 'INACTIVE'),
	(117, '45', 'ABC123', '127', 'INACTIVE'),
	(118, '45', 'ABC123', '023', 'INACTIVE'),
	(119, '45', 'ABC123', '279', 'INACTIVE'),
	(120, '45', 'ABC123', '729', 'INACTIVE'),
	(121, '45', 'ABC123', '965', 'INACTIVE'),
	(122, '45', 'ABC123', '213', 'INACTIVE'),
	(123, '45', 'ABC123', '892', 'INACTIVE'),
	(124, '45', 'ABC123', '208', 'INACTIVE'),
	(125, '45', 'ABC123', '869', 'INACTIVE'),
	(126, '45', 'ABC123', '829', 'INACTIVE'),
	(127, '45', 'ABC123', '438', 'INACTIVE'),
	(128, '45', 'ABC123', '873', 'INACTIVE'),
	(129, '45', 'ABC123', '641', 'INACTIVE'),
	(130, '45', 'ABC123', '933', 'INACTIVE'),
	(131, '45', 'ABC123', '042', 'INACTIVE'),
	(132, '45', 'ABC123', '605', 'INACTIVE'),
	(133, '45', 'ABC123', '667', 'INACTIVE'),
	(134, '45', 'ABC123', '273', 'INACTIVE'),
	(135, '45', 'ABC123', '026', 'INACTIVE'),
	(136, '45', 'ABC123', '147', 'INACTIVE'),
	(137, '45', 'ABC123', '330', 'INACTIVE'),
	(138, '45', 'ABC123', '369', 'INACTIVE'),
	(139, '45', 'ABC123', '427', 'INACTIVE'),
	(140, '45', 'ABC123', '570', 'INACTIVE'),
	(141, '45', 'ABC123', '884', 'INACTIVE'),
	(142, '45', 'ABC123', '114', 'INACTIVE'),
	(143, '45', 'ABC123', '763', 'INACTIVE'),
	(144, '45', 'ABC123', '800', 'INACTIVE'),
	(145, '45', 'ABC123', '645', 'INACTIVE'),
	(146, '45', 'ABC123', '587', 'INACTIVE'),
	(147, '45', 'ABC123', '409', 'INACTIVE'),
	(148, '45', 'ABC123', '972', 'INACTIVE'),
	(149, '45', 'ABC123', '973', 'INACTIVE'),
	(150, '45', 'ABC123', '480', 'INACTIVE'),
	(151, '45', 'ABC123', '332', 'INACTIVE'),
	(152, '45', 'ABC123', '264', 'INACTIVE'),
	(153, '45', 'ABC123', '616', 'INACTIVE'),
	(154, '45', 'ABC123', '038', 'INACTIVE'),
	(155, '45', 'ABC123', '028', 'INACTIVE'),
	(156, '45', 'ABC123', '244', 'INACTIVE'),
	(157, '45', 'ABC123', '004', 'INACTIVE'),
	(158, '45', 'ABC123', '414', 'INACTIVE'),
	(159, '45', 'ABC123', '121', 'INACTIVE'),
	(160, '45', 'ABC123', '656', 'INACTIVE'),
	(161, '45', 'ABC123', '316', 'INACTIVE'),
	(162, '45', 'ABC123', '459', 'INACTIVE'),
	(163, '45', 'ABC123', '446', 'INACTIVE'),
	(164, '45', 'ABC123', '143', 'INACTIVE'),
	(165, '45', 'ABC123', '540', 'INACTIVE'),
	(166, '45', 'ABC123', '867', 'INACTIVE'),
	(167, '45', 'ABC123', '802', 'INACTIVE'),
	(168, '45', 'ABC123', '524', 'INACTIVE'),
	(169, '45', 'ABC123', '287', 'INACTIVE'),
	(170, '45', 'ABC123', '634', 'INACTIVE'),
	(171, '45', 'ABC123', '188', 'INACTIVE'),
	(172, '45', 'ABC123', '564', 'INACTIVE'),
	(173, '45', 'ABC123', '732', 'INACTIVE'),
	(174, '45', 'ABC123', '046', 'INACTIVE'),
	(175, '45', 'ABC123', '516', 'INACTIVE'),
	(176, '45', 'ABC123', '701', 'INACTIVE'),
	(177, '45', 'ABC123', '861', 'INACTIVE'),
	(178, '45', 'ABC123', '118', 'INACTIVE'),
	(179, '45', 'ABC123', '215', 'INACTIVE'),
	(180, '45', 'ABC123', '535', 'INACTIVE'),
	(181, '45', 'ABC123', '966', 'INACTIVE'),
	(182, '45', 'ABC123', '923', 'INACTIVE'),
	(183, '45', 'ABC123', '241', 'INACTIVE'),
	(184, '45', 'ABC123', '938', 'INACTIVE'),
	(185, '45', 'ABC123', '202', 'INACTIVE'),
	(186, '45', 'ABC123', '796', 'INACTIVE'),
	(187, '45', 'ABC123', '431', 'INACTIVE'),
	(188, '45', 'ABC123', '689', 'INACTIVE'),
	(189, '45', 'ABC123', '847', 'INACTIVE'),
	(190, '45', 'ABC123', '946', 'INACTIVE'),
	(191, '45', 'ABC123', '364', 'INACTIVE');
/*!40000 ALTER TABLE `luck_numbers` ENABLE KEYS */;

-- Copiando estrutura para tabela rifa.payments
CREATE TABLE IF NOT EXISTS `payments` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `payment_id` varchar(100) DEFAULT NULL,
  `status` varchar(100) DEFAULT 'AWAITING',
  `qrcode` varchar(100) DEFAULT 'AWAITING',
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lead_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

-- Copiando dados para a tabela rifa.payments: 0 rows
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;

-- Copiando estrutura para tabela rifa.prize
CREATE TABLE IF NOT EXISTS `prize` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(100) DEFAULT NULL,
  `prize_end` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `prize` varchar(100) DEFAULT NULL,
  `prize_pre` varchar(100) DEFAULT NULL,
  `site` varchar(100) DEFAULT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `prize_price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

-- Copiando dados para a tabela rifa.prize: 1 rows
/*!40000 ALTER TABLE `prize` DISABLE KEYS */;
REPLACE INTO `prize` (`id`, `uuid`, `prize_end`, `prize`, `prize_pre`, `site`, `created`, `prize_price`) VALUES
	(1, 'ABC123', '2021-12-30 09:16:20', 'Pix de 500 Reais', 'um', NULL, '2021-12-15 09:16:21', 500.00);
/*!40000 ALTER TABLE `prize` ENABLE KEYS */;

-- Copiando estrutura para tabela rifa.tasks
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(100) DEFAULT NULL,
  `message` varchar(100) DEFAULT NULL,
  `buttons` varchar(100) DEFAULT NULL,
  `to` varchar(100) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `scheduled` timestamp NULL DEFAULT NULL,
  `send` timestamp NULL DEFAULT NULL,
  `status` varchar(100) DEFAULT 'AWAITING',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

-- Copiando dados para a tabela rifa.tasks: 1 rows
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
REPLACE INTO `tasks` (`id`, `uuid`, `message`, `buttons`, `to`, `type`, `created`, `scheduled`, `send`, `status`) VALUES
	(2, NULL, NULL, NULL, NULL, NULL, '2021-12-15 09:42:43', '2021-12-15 09:44:49', '2021-12-15 09:42:44', NULL);
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
