-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 20, 2024 at 11:28 AM
-- Server version: 8.0.35-0ubuntu0.22.04.1
-- PHP Version: 8.1.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `configKW`
--

-- --------------------------------------------------------

--
-- Table structure for table `applicationVersions`
--

CREATE TABLE `applicationVersions` (
  `id` int UNSIGNED NOT NULL,
  `versionNumber` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `summary` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userManual` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `modifiedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `applicationVersions`
--

INSERT INTO `applicationVersions` (`id`, `versionNumber`, `summary`, `userManual`, `createdAt`, `modifiedAt`) VALUES
(9, '1.0', 'Initial Version', NULL, '2022-11-18 11:31:59', '2022-12-24 10:25:07'),
(14, '1.3', 'Second Version', NULL, '2022-12-24 11:00:15', '2023-01-18 15:04:12'),
(15, '1.4', 'Third Version', NULL, '2022-12-24 11:01:02', '2023-01-18 15:05:38'),
(16, '1.5', 'Update to multiVersion', NULL, '2023-01-18 15:06:22', '2023-01-18 15:06:22'),
(17, '1.6', 'Latest Version', NULL, '2023-08-07 07:06:53', '2023-08-07 07:06:53'),
(18, '1.7', 'DB Update Version', NULL, '2023-12-15 07:06:53', '0000-00-00 00:00:00'),
(19, '1.8', 'Optimized Version', 'UserManual/UserManual.pdf', '2024-01-15 08:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `aqi`
--

CREATE TABLE `aqi` (
  `id` int NOT NULL,
  `parameter` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `units` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `good` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `satisfactory` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `moderately` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `poor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `veryPoor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `severe` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `aqi`
--

INSERT INTO `aqi` (`id`, `parameter`, `units`, `good`, `satisfactory`, `moderately`, `poor`, `veryPoor`, `severe`, `createdAt`, `updatedAt`) VALUES
(1, 'AQI', NULL, '0,50', '51,100', '101,200', '201,300', '301,400', '401,500', '2024-01-30 08:16:50', '2024-01-30 08:16:50'),
(2, 'PM10', 'µg/m3', '0,50', '51,100', '101,250', '251,300', '351,430', '431,510', '2024-01-30 08:17:40', '2024-01-30 08:17:40'),
(3, 'PM2.5', 'µg/m3', '0,30', '31,60', '61,90', '91,120', '121,250', '251,380', '2024-01-30 08:20:50', '2024-01-30 08:20:50'),
(4, 'NO2', 'ppm', '0,0.0213', '0.0214,0.0426', '0.0427,0.0957', '0.0958,0.1489', '0.1490,0.2128', '0.2129,0.2766', '2024-01-30 08:22:15', '2024-01-30 08:22:15'),
(5, 'O3', 'µg/m3', '0,50', '51,100', '101,168', '169,208', '209,748', '749,1287', '2024-01-30 08:23:22', '2024-01-30 08:23:22'),
(6, 'CO', 'mg/m3', '0,1.0', '1.1,2.0', '2.1,10', '10,17', '18,34', '35,51', '2024-01-30 08:26:20', '2024-01-30 08:26:20'),
(7, 'SO2', 'ppm', '0,0.0153', '0.0154,0.0305', '0.0306,0.1450', '0.1451,0.3053', '0.3054,0.6107', '0.6108,0.9160', '2024-01-30 08:27:27', '2024-01-30 08:27:27'),
(8, 'NH3', 'µg/m3', '0,200', '201,400', '401,800', '801,1200', '1201,1800', '1801,2400', '2024-01-30 08:30:44', '2024-01-30 08:30:44'),
(9, 'Pb', 'µg/m3', '0,0.5', '0.6,1.0', '1.1,2.0', '2.1,3.0', '3.1,3.5', '3.6,4.0', '2024-01-30 08:31:48', '2024-01-30 08:31:48'),
(16, 'SO2', 'µg/m3', '0,40', '41,80', '81,380', '381,800', '801,1600', '1601,2400', '2024-02-08 05:02:19', '2024-02-08 05:02:19'),
(17, 'NO2', 'µg/m3', '0,40', '41,80', '81,180', '181,280', '281,400', '401,520', '2024-02-08 05:03:11', '2024-02-08 05:03:11'),
(18, 'NO2', 'mg/m3', '0,0.04', '0.041,0.08', '0.081,0.180', '0.181,0.28', '0.281,0.4', '0.401,0.52', '2024-02-08 05:05:29', '2024-02-08 05:05:29'),
(19, 'SO2', 'mg/m3', '0,0.04', '0.041,0.08', '0.081,0.38', '0.381,0.8', '0.801,1.6', '1.601,2.4', '2024-02-08 05:07:05', '2024-02-08 05:07:05'),
(20, 'CO', 'ppm', '0,0.8729', '0.9602,1.7458', '1.8331,8.7290', '8.8163,14.8393', '14.9266,29.6787', '30.5516,44.5180', '2024-02-08 05:08:17', '2024-02-08 05:08:17'),
(21, 'O3', 'mg/m3', '0,0.05', '0.051,0.1', '0.101,0.1680', '0.169,0.208', '0.209,0.748', '0.749,1.2870', '2024-02-08 05:12:07', '2024-02-08 05:12:07'),
(22, 'O3', 'ppm', '0,0.0255', '0.026,0.0509', '0.0514,0.0856', '0.0861,0.106', '0.1065,0.3810', '0.3815,0.6556', '2024-02-08 05:13:04', '2024-02-08 05:13:04'),
(23, 'NH3', 'mg/m3', '0,0.2', '0.201,0.4', '0.401,0.8', '0.801,1.2', '1.201,1.8', '1.801,2.4', '2024-02-08 05:15:51', '2024-02-08 05:15:51'),
(24, 'NH3', 'ppm', '0,0.2871', '0.2886,0.5743', '0.5757,1.486', '1.15,1.7228', '1.7243,2.5843', '2.5857,3.4457', '2024-02-08 05:17:25', '2024-02-08 05:17:25'),
(25, 'NO2', 'ppb', '0,21.2562', '21.7877,42.5125', '43.0439,95.6531', '96.1845,148.7937', '149.3251,212.5625', '213.0939,276.3312', '2024-02-15 04:09:06', '2024-02-15 04:09:06'),
(26, 'SO2', 'ppb', '0,15.2669', '15.6486,30.5339', '30.9155,145.0359', '145.4176,305.3387', '305.7204,610.6775', '611.092,916.0162', '2024-02-15 04:14:10', '2024-02-15 04:14:10'),
(27, 'CO', 'ppb', '0,872.9025', '960.1928,1745.8051', '1833.0953,8729.0253', '8816.3156,14839.3431', '14926.6333,29678.6862', '30551.5887,44518.0293', '2024-02-15 04:18:28', '2024-02-15 04:18:28'),
(28, 'O3', 'ppb', '0,25.4688', '25.9781,50.9375', '51.4469,85.5750', '86.0844,105.950', '106.4594,381.0125', '381.5219,655.5656', '2024-02-15 04:24:40', '2024-02-15 04:24:40'),
(29, 'NH3', 'ppb', '0,287.1403', '288.5760,574.2807', '575.7164,1148.5614', '1149.9971,1722.8420', '1724.2777,2584.2631', '2585.6988,3445.6841', '2024-02-15 04:28:52', '2024-02-15 04:28:52'),
(30, 'Pb', 'ppb', '0,0.059', '0.0708,0.1180', '0.1298,0.2360', '0.2478,0.3540', '0.3658,0.4130', '0.4295,0.4720', '2024-02-15 04:50:02', '2024-02-15 04:50:02');

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `id` int NOT NULL,
  `locationID` int DEFAULT NULL,
  `branchName` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `coordinates` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `image` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentID` int DEFAULT NULL,
  `dispStatus` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dispAqiValue` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dispCategory` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `buildings`
--

CREATE TABLE `buildings` (
  `id` int NOT NULL,
  `locationID` int DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `facilityID` int DEFAULT NULL,
  `buildingName` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `coordinates` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `image` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentID` int DEFAULT NULL,
  `buildingTag` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dispStatus` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dispAqiValue` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dispCategory` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `categoryName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `categoryDescription` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `categoryName`, `categoryDescription`, `createdAt`, `modifiedAt`) VALUES
(4, 'IAQ', 'IAQ', '2024-01-30 10:11:28', '2024-01-30 10:11:28'),
(5, 'SEM', 'SEM', '2024-01-30 10:11:37', '2024-01-30 10:11:37'),
(6, 'AQI', 'AQI', '2024-01-30 10:11:47', '2024-01-30 10:11:47'),
(11, 'AQMo', 'Outdoor Device', '2024-02-15 07:23:23', '2024-02-15 07:23:23'),
(12, 'AQMi', 'Indoor Device', '2024-02-15 07:23:35', '2024-02-15 07:23:35');

-- --------------------------------------------------------

--
-- Table structure for table `communication`
--

CREATE TABLE `communication` (
  `id` int NOT NULL,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `isWifi` int DEFAULT NULL,
  `isGSM` int DEFAULT NULL,
  `isFTP` int DEFAULT NULL,
  `wifiInfo` json DEFAULT NULL,
  `gsmInfo` json DEFAULT NULL,
  `ftpInfo` json DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `id` int NOT NULL,
  `companyName` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `companyCode` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '2 Characer Index for DB suffix',
  `email` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `website` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `imageInfo` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `companyInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `contactInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`id`, `companyName`, `companyCode`, `email`, `website`, `imageInfo`, `companyInfo`, `contactInfo`, `createdAt`, `updatedAt`) VALUES
(2, 'Kewaunee Labway India Pvt Ltd', 'KW', 'aqmx@grandco.ca', 'https://www.randcopayments.com/', '{\"logo\":\"company/KW/logo.jpg\", \"loginPageImage\":\"company/KW/image.png\", \"companyName\": \"Kewaunee Labway India Pvt Ltd\"}', NULL, NULL, '2023-12-14 03:48:36', '2023-12-28 09:21:56');

-- --------------------------------------------------------

--
-- Table structure for table `devices`
--

CREATE TABLE `devices` (
  `id` int UNSIGNED NOT NULL,
  `locationID` int UNSIGNED DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `facilityID` int DEFAULT NULL,
  `buildingID` int DEFAULT NULL,
  `floorID` int DEFAULT NULL,
  `coordinates` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zoneID` int DEFAULT NULL,
  `parentID` int DEFAULT NULL,
  `image` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deviceName` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoryID` int DEFAULT NULL,
  `deviceCategory` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `connStatus` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `firmwareVersion` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `macAddress` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deviceTag` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nonPollingPriority` int DEFAULT NULL,
  `pollingPriority` int DEFAULT NULL,
  `dataPushUrl` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `firmwarePushUrl` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `binFileName` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deviceMode` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hardwareModelVersion` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `disconnectionStatus` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notificationShow` int DEFAULT NULL,
  `modifiedBy` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modifiedStatus` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `connectionInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `emailTextInfo`
--

CREATE TABLE `emailTextInfo` (
  `id` int NOT NULL,
  `rptID` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `subject` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `body` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `emailTextInfo`
--

INSERT INTO `emailTextInfo` (`id`, `rptID`, `subject`, `body`) VALUES
(1, 'SENSOR_REPORT', 'Sensor Report - <TAG>', '<p>*This is a system generated email. Do not reply to sender.</p><p><br></p><p>Hi,</p><p><br></p><p>Please find attached the Sensor Status Report generated with below conditions.</p><p><br></p><p><strong>From Date:</strong></p><p><strong>To Date:</strong></p><p><strong>Device Name:</strong></p><p><br></p><p>Continue on EMS:</p><p><br></p><p>Best Regards</p><p>EMS Admin</p>'),
(2, 'AQI_REPORT', 'Air Quality Index (AQI) Report - <TAG>', '<p>*This is a system generated email. Do not reply to sender.</p><p><br></p><p>Hi,</p><p><br></p><p>Please find attached Air Quality Index Report generated with below conditions.</p><p><br></p><p><strong>From Date: </strong></p><p><strong>To Date: </strong></p><p><strong>Zone Name:</strong></p><p><br></p><p>Continue on EMS:</p><p><br></p><p>Best Regards</p><p>EMS Admin</p>'),
(3, 'ALARM_REPORT', 'Alarms Report - <TAG>', '<p>*This is a system generated email. Do not reply to sender.</p><p><br></p><p>Hi,</p><p><br></p><p>Please find attached Alarms Report generated with below conditions.</p><p><br></p><p><strong>From Date: </strong></p><p><strong>To Date:</strong></p><p><br></p><p>Continue on EMS:</p><p><br></p><p>Best Regards</p><p>EMS Admin</p>'),
(4, 'SERVER_REPORT', 'Server Utilization Report Test', '<p>*This is a system generated email. Do not reply to sender.</p><p><br></p><p>Hi,</p><p><br></p><p>Please find attached Server Utilization Report generated with below conditions.</p><p><br></p><p><strong>From Date: </strong></p><p><strong>To Date:</strong></p><p><br></p><p>Continue on EMS:&nbsp;</p><p><br></p><p>Best Regards</p><p>EMS Admin</p>'),
(5, 'FIRMWARE_REPORT', 'Firmware Version Report', '<p>*This is a system generated email. Do not reply to sender.</p><p><br></p><p>Hi,</p><p><br></p><p>Please find attached Firmware Version Report generated.</p><p><br></p><p>Continue on EMS:</p><p><br></p><p>Best Regards</p><p>EMS Admin</p>'),
(6, 'ALARM_DAILY_REPORT', 'Daily Alarms Report', '<p>*This is a system generated email. Do not reply to sender.</p><p><br></p><p>Hi,</p><p><br></p><p>Please find attached the Daily Alarms Report</p><p><br></p><p><strong>Date: </strong></p><p><br></p><p>Continue on EMS: </p><p><br></p><p>Best Regards</p><p>EMS Admin</p>'),
(7, 'APPLICATION_VERSION_REPORT', 'Application Version Report', '<p>*This is a system generated email. Do not reply to sender.</p><p><br></p><p>Hi,</p><p><br></p><p>Please find attached the generated Application Version Report.</p><p><br></p><p>Continue on EMS:</p><p><br></p><p>Best Regards</p><p>EMS Admin</p>'),
(8, 'USER_REPORT', 'User Log Report', '<p>*This is a system generated email. Do not reply to sender.</p><p><br></p><p>Hi,</p><p><br></p><p>Please find attached the generated User Log Report.</p><p><br></p><p><strong>From Date:</strong></p><p><strong>To Date:</strong></p><p><br></p><p>Continue on EMS:</p><p><br></p><p>Best Regards</p><p>Admin</p>'),
(9, 'CALIBRATION_REPORT', 'Calibration Report', '<p>*This is a system generated email. Do not reply to sender.</p><p><br></p><p>Hi,</p><p><br></p><p>Please find attached the generated Calibration Report.</p><p><br></p><p><strong>From Date:</strong></p><p><strong>To Date:</strong></p><p><br></p><p>Continue on EMS:</p><p><br></p><p>Best Regards</p><p>EMS Admin</p>'),
(10, 'BUMP_TEST_REPORT', 'Bump Test Report', '<p>*This is a system generated email. Do not reply to sender.</p><p><br></p><p>Hi,</p><p><br></p><p>Please find attached the generated Bump Test Report.</p><p><br></p><p><strong>From Date:</strong></p><p><strong>To Date:</strong></p><p><br></p><p>Continue on EMS:</p><p><br></p><p>Best Regards</p><p>EMS Admin</p>');

-- --------------------------------------------------------

--
-- Table structure for table `facilities`
--

CREATE TABLE `facilities` (
  `id` int NOT NULL,
  `locationID` int DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `facilityName` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `coordinates` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `image` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentID` int DEFAULT NULL,
  `dispStatus` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dispAqiValue` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dispCategory` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `floors`
--

CREATE TABLE `floors` (
  `id` int NOT NULL,
  `locationID` int DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `facilityID` int DEFAULT NULL,
  `buildingID` int DEFAULT NULL,
  `floorName` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `coordinates` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `image` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentID` int DEFAULT NULL,
  `dispStatus` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dispAqiValue` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dispCategory` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int NOT NULL,
  `locationName` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `coordinates` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `image` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentID` int DEFAULT NULL,
  `dispStatus` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dispAqiValue` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dispCategory` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sensorOutputTypes`
--

CREATE TABLE `sensorOutputTypes` (
  `id` int NOT NULL,
  `sensorOutputType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `otherSensorInfo` json DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sensorOutputTypes`
--

INSERT INTO `sensorOutputTypes` (`id`, `sensorOutputType`, `otherSensorInfo`, `createdAt`, `updatedAt`) VALUES
(2, 'Analog', NULL, '2024-01-24 15:06:35', '2024-01-24 15:06:35'),
(3, 'Digital', NULL, '2024-01-24 15:07:21', '2024-01-24 15:07:21'),
(4, 'Inbuilt', NULL, '2024-01-25 11:38:36', '2024-01-25 11:38:36'),
(6, 'Modbus', NULL, '2024-01-31 09:31:56', '2024-01-31 09:31:56');

-- --------------------------------------------------------

--
-- Table structure for table `sensors`
--

CREATE TABLE `sensors` (
  `id` int NOT NULL,
  `locationID` int DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `facilityID` int DEFAULT NULL,
  `buildingID` int DEFAULT NULL,
  `floorID` int DEFAULT NULL,
  `zoneID` int DEFAULT NULL,
  `deviceID` int DEFAULT NULL,
  `parentID` int DEFAULT NULL,
  `deviceCategory` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sensorName` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sensorTag` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sensorCategory` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `slotID` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `defaultValue` decimal(8,4) DEFAULT NULL,
  `alarmType` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Latch,UnLatch',
  `bumpTest` tinyint(1) DEFAULT NULL,
  `calibrationTest` tinyint(1) DEFAULT NULL,
  `isStel` tinyint(1) DEFAULT NULL,
  `isTwa` tinyint(1) DEFAULT NULL,
  `isAQI` tinyint(1) DEFAULT NULL,
  `bumpInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `calibrationInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `scaleInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `stelInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `twaInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `modBusInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `criticalAlertInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `warningAlertInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `outOfRangeAlertInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `digitalAlertInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `sensorOutput` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `units` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sensorStatus` int DEFAULT NULL,
  `notificationStatus` int DEFAULT NULL,
  `manufacturer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `partID` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sensorsType`
--

CREATE TABLE `sensorsType` (
  `id` int NOT NULL,
  `sensorType` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sensorCategory` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `alarmType` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Latch,UnLatch',
  `bumpTest` tinyint(1) DEFAULT NULL,
  `calibrationTest` tinyint(1) DEFAULT NULL,
  `isStel` tinyint(1) DEFAULT NULL,
  `isTwa` tinyint(1) DEFAULT NULL,
  `isAQI` tinyint(1) DEFAULT NULL,
  `bumpInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `calibrationInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `scaleInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `stelInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `twaInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `modBusInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `criticalAlertInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `warningAlertInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `outOfRangeAlertInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `digitalAlertInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `sensorOutput` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `units` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `manufacturer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `partID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sensorsType`
--

INSERT INTO `sensorsType` (`id`, `sensorType`, `sensorCategory`, `alarmType`, `bumpTest`, `calibrationTest`, `isStel`, `isTwa`, `isAQI`, `bumpInfo`, `calibrationInfo`, `scaleInfo`, `stelInfo`, `twaInfo`, `modBusInfo`, `criticalAlertInfo`, `warningAlertInfo`, `outOfRangeAlertInfo`, `digitalAlertInfo`, `sensorOutput`, `units`, `manufacturer`, `partID`, `createdAt`, `modifiedAt`) VALUES
(6, 'Temperature - IAQ', NULL, 'Latch', 0, NULL, 0, 0, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{}', '{}', NULL, '{\"cMin\":\"10\",\"cMax\":\"45\"}', '{\"wMin\":\"12\",\"wMax\":\"40\"}', '{\"oMin\":\"-40\",\"oMax\":\"85\"}', NULL, '4', '7', NULL, NULL, '2024-02-14 07:45:50', '2024-02-14 07:45:50'),
(7, 'Humidity - IAQ', NULL, 'Latch', 0, NULL, 0, 0, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{}', '{}', NULL, '{\"cMin\":\"0\",\"cMax\":\"95\"}', '{\"wMin\":\"0\",\"wMax\":\"90\"}', '{\"oMin\":\"0\",\"oMax\":\"100\"}', NULL, '4', '8', NULL, NULL, '2024-02-14 07:47:33', '2024-02-14 07:47:33'),
(8, 'TVOC - IAQ', NULL, 'Latch', 0, NULL, 0, 0, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{}', '{}', NULL, '{\"cMin\":\"0\",\"cMax\":\"3600\"}', '{\"wMin\":\"0\",\"wMax\":\"1800\"}', '{\"oMin\":\"0\",\"oMax\":\"65000\"}', NULL, '4', '2', NULL, NULL, '2024-02-14 07:48:53', '2024-02-14 07:48:53'),
(9, 'CO2 - IAQ', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"30000\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"5000\",\"twaDuration\":\"480\",\"twaStartTime\":\"13:18\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"10000\"}', '{\"wMin\":\"0\",\"wMax\":\"5000\"}', '{\"oMin\":\"0\",\"oMax\":\"32000\"}', NULL, '4', '1', NULL, NULL, '2024-02-14 07:51:28', '2024-02-14 07:51:28'),
(10, 'PM10 - IAQ', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"250\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"100\",\"twaDuration\":\"480\",\"twaStartTime\":\"13:21\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"430\"}', '{\"wMin\":\"0\",\"wMax\":\"350\"}', '{\"oMin\":\"0\",\"oMax\":\"1000\"}', NULL, '4', '3', NULL, NULL, '2024-02-14 07:53:06', '2024-02-14 07:53:06'),
(11, 'PM2.5 - IAQ', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"90\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"60\",\"twaDuration\":\"480\",\"twaStartTime\":\"13:23\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"250\"}', '{\"wMin\":\"0\",\"wMax\":\"120\"}', '{\"oMin\":\"0\",\"oMax\":\"1000\"}', NULL, '4', '3', NULL, NULL, '2024-02-14 07:54:50', '2024-02-14 07:54:50'),
(12, 'Oxygen - IAQ', NULL, 'Latch', 0, NULL, 0, 0, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{}', '{}', NULL, '{\"cMin\":\"16\",\"cMax\":\"24\"}', '{\"wMin\":\"19.5\",\"wMax\":\"22.5\"}', '{\"oMin\":\"0\",\"oMax\":\"25\"}', NULL, '4', '5', NULL, NULL, '2024-02-14 07:56:51', '2024-02-14 07:56:51'),
(13, 'TVOC - SEM', NULL, 'Latch', 0, NULL, 0, 0, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{}', '{}', NULL, '{\"cMin\":\"0\",\"cMax\":\"3600\"}', '{\"wMin\":\"0\",\"wMax\":\"1800\"}', '{\"oMin\":\"0\",\"oMax\":\"65000\"}', NULL, '4', '2', NULL, NULL, '2024-02-14 08:33:57', '2024-02-14 08:33:57'),
(14, 'eCO2 - SEM', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"30000\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"5000\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:04\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"10000\"}', '{\"wMin\":\"0\",\"wMax\":\"5000\"}', '{\"oMin\":\"400\",\"oMax\":\"65000\"}', NULL, '4', '1', NULL, NULL, '2024-02-14 08:35:41', '2024-02-14 08:35:41'),
(15, 'PM10 - SEM', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"250\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"100\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:05\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"430\"}', '{\"wMin\":\"0\",\"wMax\":\"350\"}', '{\"oMin\":\"0\",\"oMax\":\"1000\"}', NULL, '4', '3', NULL, NULL, '2024-02-14 08:37:14', '2024-02-14 08:37:14'),
(16, 'PM2.5 - SEM', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"90\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"60\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:09\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"250\"}', '{\"wMin\":\"0\",\"wMax\":\"120\"}', '{\"oMin\":\"0\",\"oMax\":\"1000\"}', NULL, '4', '3', NULL, NULL, '2024-02-14 08:40:21', '2024-02-14 08:40:21'),
(17, 'Oxygen - SEM', NULL, 'Latch', 0, NULL, 0, 0, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{}', '{}', NULL, '{\"cMin\":\"16\",\"cMax\":\"24\"}', '{\"wMin\":\"24\",\"wMax\":\"19.5\"}', '{\"oMin\":\"0\",\"oMax\":\"25\"}', NULL, '4', '5', NULL, NULL, '2024-02-14 08:41:26', '2024-02-14 08:41:26'),
(18, 'CH4 - SEM', NULL, 'Latch', 0, NULL, 0, 0, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{}', '{}', NULL, '{\"cMin\":\"0\",\"cMax\":\"40\"}', '{\"wMin\":\"0\",\"wMax\":\"20\"}', '{\"oMin\":\"0\",\"oMax\":\"100\"}', NULL, '4', '6', NULL, NULL, '2024-02-14 08:42:58', '2024-02-14 08:42:58'),
(19, 'C2H4 - SEM', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"5\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"1\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:13\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"10\"}', '{\"wMin\":\"0\",\"wMax\":\"5\"}', '{\"oMin\":\"0\",\"oMax\":\"100\"}', NULL, '4', '1', NULL, NULL, '2024-02-14 08:44:07', '2024-02-14 08:44:07'),
(20, 'Cl2 - SEM', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"0.5\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"0.25\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:14\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"1\"}', '{\"wMin\":\"0\",\"wMax\":\"0.5\"}', '{\"oMin\":\"0\",\"oMax\":\"20\"}', NULL, '4', '1', NULL, NULL, '2024-02-14 08:45:18', '2024-02-14 08:45:18'),
(21, 'CO - SEM', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"100\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"50\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:15\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"200\"}', '{\"wMin\":\"0\",\"wMax\":\"100\"}', '{\"oMin\":\"0\",\"oMax\":\"1000\"}', NULL, '4', '1', NULL, NULL, '2024-02-14 08:47:16', '2024-02-14 08:47:16'),
(22, 'Ethylene Oxide - SEM', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"5\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"1\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:17\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"10\"}', '{\"wMin\":\"0\",\"wMax\":\"5\"}', '{\"oMin\":\"0\",\"oMax\":\"100\"}', NULL, '4', '1', NULL, NULL, '2024-02-14 08:48:14', '2024-02-14 08:48:14'),
(23, 'H2 - SEM', NULL, 'Latch', 0, NULL, 0, 0, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{}', '{}', NULL, '{\"cMin\":\"0\",\"cMax\":\"16000\"}', '{\"wMin\":\"0\",\"wMax\":\"8000\"}', '{\"oMin\":\"0\",\"oMax\":\"1000\"}', NULL, '4', '1', NULL, NULL, '2024-02-14 08:58:58', '2024-02-14 08:58:58'),
(24, 'H2S - SEM', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"15\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"10\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:35\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"50\"}', '{\"wMin\":\"0\",\"wMax\":\"15\"}', '{\"oMin\":\"0\",\"oMax\":\"100\"}', NULL, '4', '1', NULL, NULL, '2024-02-14 09:07:28', '2024-02-14 09:07:28'),
(25, 'HCl - SEM', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"2.5\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"1.25\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:37\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"5\"}', '{\"wMin\":\"0\",\"wMax\":\"2.5\"}', '{\"oMin\":\"0\",\"oMax\":\"10\"}', NULL, '4', '1', NULL, NULL, '2024-02-14 09:16:51', '2024-02-14 09:16:51'),
(26, 'HF - SEM', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"6\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"3\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:46\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"12\"}', '{\"wMin\":\"0\",\"wMax\":\"6\"}', '{\"oMin\":\"0\",\"oMax\":\"10\"}', NULL, '4', '1', NULL, NULL, '2024-02-14 09:17:53', '2024-02-14 09:17:53'),
(27, 'NH3 - SEM', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"100\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"50\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:49\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"200\"}', '{\"wMin\":\"0\",\"wMax\":\"100\"}', '{\"oMin\":\"0\",\"oMax\":\"100\"}', NULL, '4', '1', NULL, NULL, '2024-02-14 09:21:39', '2024-02-14 09:21:39'),
(28, 'NO2 - SEM', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"2.5\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"1.25\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:51\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"5\"}', '{\"wMin\":\"0\",\"wMax\":\"2.5\"}', '{\"oMin\":\"0\",\"oMax\":\"20\"}', NULL, '4', '1', NULL, NULL, '2024-02-14 09:26:06', '2024-02-14 09:26:06'),
(29, 'O3 - SEM', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"0.2\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"0.1\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:56\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"0.4\"}', '{\"wMin\":\"0\",\"wMax\":\"0.2\"}', '{\"oMin\":\"0\",\"oMax\":\"10\"}', NULL, '4', '1', NULL, NULL, '2024-02-14 09:27:24', '2024-02-14 09:27:24'),
(30, 'SO2 - SEM', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', NULL, '{\"stelLimit\":\"10\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"5\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:57\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"20\"}', '{\"wMin\":\"0\",\"wMax\":\"10\"}', '{\"oMin\":\"0\",\"oMax\":\"20\"}', NULL, '4', '1', NULL, NULL, '2024-02-14 09:29:41', '2024-02-14 09:29:41'),
(31, 'PM10 - AQI', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"250\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"100\",\"twaDuration\":\"480\",\"twaStartTime\":\"14:59\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"430\"}', '{\"wMin\":\"0\",\"wMax\":\"350\"}', '{\"oMin\":\"0\",\"oMax\":\"1001\"}', NULL, '2', '3', NULL, NULL, '2024-02-14 09:31:57', '2024-02-14 09:31:57'),
(32, 'PM10 - AQI', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"250\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"100\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:02\"}}', '{\"slaveID\":\"\",\"register\":\"\",\"bitLength\":\"\"}', '{\"cMin\":\"0\",\"cMax\":\"430\"}', '{\"wMin\":\"0\",\"wMax\":\"350\"}', '{\"oMin\":\"0\",\"oMax\":\"1000\"}', NULL, '6', '3', NULL, NULL, '2024-02-14 09:33:14', '2024-02-14 09:33:14'),
(33, 'PM2.5 - AQI', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"90\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"60\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:03\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"250\"}', '{\"wMin\":\"0\",\"wMax\":\"120\"}', '{\"oMin\":\"0\",\"oMax\":\"1000\"}', NULL, '2', '3', NULL, NULL, '2024-02-14 09:34:27', '2024-02-14 09:34:27'),
(34, 'PM2.5 - AQI', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"90\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"60\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:04\"}}', '{\"slaveID\":\"\",\"register\":\"\",\"bitLength\":\"\"}', '{\"cMin\":\"0\",\"cMax\":\"250\"}', '{\"wMin\":\"0\",\"wMax\":\"120\"}', '{\"oMin\":\"0\",\"oMax\":\"1000\"}', NULL, '6', '3', NULL, NULL, '2024-02-14 09:35:38', '2024-02-14 09:35:38'),
(35, 'CO - AQI', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"100\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"50\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:05\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"200\"}', '{\"wMin\":\"0\",\"wMax\":\"100\"}', '{\"oMin\":\"0\",\"oMax\":\"1000\"}', NULL, '2', '1', NULL, NULL, '2024-02-14 09:37:21', '2024-02-14 09:37:21'),
(36, 'CO - AQI', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"100\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"50\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:07\"}}', '{\"slaveID\":\"\",\"register\":\"\",\"bitLength\":\"\"}', '{\"cMin\":\"0\",\"cMax\":\"200\"}', '{\"wMin\":\"0\",\"wMax\":\"100\"}', '{\"oMin\":\"0\",\"oMax\":\"1000\"}', NULL, '6', '1', NULL, NULL, '2024-02-14 09:38:44', '2024-02-14 09:38:44'),
(37, 'NH3 - AQI', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"100\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"50\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:08\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"200\"}', '{\"wMin\":\"0\",\"wMax\":\"100\"}', '{\"oMin\":\"0\",\"oMax\":\"100\"}', NULL, '2', '1', NULL, NULL, '2024-02-14 09:40:34', '2024-02-14 09:40:34'),
(38, 'NH3 - AQI', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"100\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"50\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:10\"}}', '{\"slaveID\":\"\",\"register\":\"\",\"bitLength\":\"\"}', '{\"cMin\":\"0\",\"cMax\":\"200\"}', '{\"wMin\":\"0\",\"wMax\":\"100\"}', '{\"oMin\":\"0\",\"oMax\":\"100\"}', NULL, '6', '1', NULL, NULL, '2024-02-14 09:41:33', '2024-02-14 09:41:33'),
(39, 'NO2 - AQI', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"2.5\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"1.25\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:11\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"5\"}', '{\"wMin\":\"0\",\"wMax\":\"2.5\"}', '{\"oMin\":\"0\",\"oMax\":\"20\"}', NULL, '2', '1', NULL, NULL, '2024-02-14 09:42:50', '2024-02-14 09:42:50'),
(40, 'NO2 - AQI', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"2.5\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"1.25\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:12\"}}', '{\"slaveID\":\"\",\"register\":\"\",\"bitLength\":\"\"}', '{\"cMin\":\"0\",\"cMax\":\"5\"}', '{\"wMin\":\"0\",\"wMax\":\"2.5\"}', '{\"oMin\":\"0\",\"oMax\":\"20\"}', NULL, '6', '1', NULL, NULL, '2024-02-14 09:44:01', '2024-02-14 09:44:01'),
(41, 'O3 - AQI', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"0.2\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"0.1\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:14\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"0.4\"}', '{\"wMin\":\"0\",\"wMax\":\"0.2\"}', '{\"oMin\":\"0\",\"oMax\":\"10\"}', NULL, '2', '1', NULL, NULL, '2024-02-14 09:45:33', '2024-02-14 09:45:33'),
(42, 'O3 - AQI', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"0.2\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"0.1\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:15\"}}', '{\"slaveID\":\"\",\"register\":\"\",\"bitLength\":\"\"}', '{\"cMin\":\"0\",\"cMax\":\"0.4\"}', '{\"wMin\":\"0\",\"wMax\":\"0.2\"}', '{\"oMin\":\"0\",\"oMax\":\"10\"}', NULL, '6', '1', NULL, NULL, '2024-02-14 09:47:11', '2024-02-14 09:47:11'),
(43, 'PB - AQI', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"0.012\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"0.0060\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:17\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"0.024\"}', '{\"wMin\":\"0\",\"wMax\":\"0.012\"}', '{\"oMin\":\"0\",\"oMax\":\"5\"}', NULL, '2', '1', NULL, NULL, '2024-02-14 09:49:31', '2024-02-14 09:49:31'),
(44, 'PB - AQI', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"0.012\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"0.0060\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:19\"}}', '{\"slaveID\":\"\",\"register\":\"\",\"bitLength\":\"\"}', '{\"cMin\":\"0\",\"cMax\":\"0.024\"}', '{\"wMin\":\"0\",\"wMax\":\"0.012\"}', '{\"oMin\":\"0\",\"oMax\":\"5\"}', NULL, '6', '1', NULL, NULL, '2024-02-14 09:50:33', '2024-02-14 09:50:33'),
(45, 'SO2 - AQI', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"10\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"5\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:20\"}}', NULL, '{\"cMin\":\"0\",\"cMax\":\"20\"}', '{\"wMin\":\"0\",\"wMax\":\"10\"}', '{\"oMin\":\"0\",\"oMax\":\"20\"}', NULL, '2', '1', NULL, NULL, '2024-02-14 09:51:37', '2024-02-14 09:51:37'),
(46, 'SO2 - AQI', NULL, 'Latch', 0, NULL, 1, 1, 0, NULL, '{\"deviationForZeroCheck\":\"\",\"deviationForSpanCheck\":\"\"}', '{\"minR\":\"\",\"minRS\":\"\",\"maxR\":\"\",\"maxRS\":\"\"}', '{\"stelLimit\":\"10\",\"stelDuration\":\"15\"}', '{\"shift1\":{\"twaShiftId\":\"1\",\"twaLimit\":\"5\",\"twaDuration\":\"480\",\"twaStartTime\":\"15:21\"}}', '{\"slaveID\":\"\",\"register\":\"\",\"bitLength\":\"\"}', '{\"cMin\":\"0\",\"cMax\":\"20\"}', '{\"wMin\":\"0\",\"wMax\":\"10\"}', '{\"oMin\":\"0\",\"oMax\":\"20\"}', NULL, '6', '1', NULL, NULL, '2024-02-14 09:52:36', '2024-02-14 09:52:36');

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

CREATE TABLE `units` (
  `id` int NOT NULL,
  `unitLabel` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `unitMeasure` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `units`
--

INSERT INTO `units` (`id`, `unitLabel`, `unitMeasure`, `createdAt`, `modifiedAt`) VALUES
(1, 'ppm', 'parts per million', '2024-01-24 15:05:25', '2024-02-07 13:27:31'),
(2, 'ppb', NULL, '2024-01-31 09:32:34', '2024-01-31 09:32:34'),
(3, 'µg/m3', NULL, '2024-01-31 09:32:46', '2024-01-31 09:32:46'),
(4, 'µg/m4', NULL, '2024-01-31 09:32:58', '2024-01-31 09:32:58'),
(5, '%vol', NULL, '2024-01-31 09:33:10', '2024-01-31 09:33:10'),
(6, '% LEL', NULL, '2024-01-31 09:33:21', '2024-01-31 09:33:21'),
(7, '°C', NULL, '2024-01-31 09:33:42', '2024-01-31 09:33:42'),
(8, '%', NULL, '2024-01-31 09:33:51', '2024-01-31 09:33:51'),
(9, 'mg/m3', NULL, '2024-02-08 04:21:48', '2024-02-08 04:21:48');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobileNumber` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employeeID` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyCode` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `locationID` int UNSIGNED DEFAULT NULL,
  `branchID` int UNSIGNED DEFAULT NULL,
  `facilityID` int UNSIGNED DEFAULT NULL,
  `buildingID` int UNSIGNED DEFAULT NULL,
  `floorID` int UNSIGNED DEFAULT NULL,
  `zoneID` int UNSIGNED DEFAULT NULL,
  `userRole` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `changePassword` tinyint(1) NOT NULL DEFAULT '1',
  `secLevelAuth` int NOT NULL DEFAULT '1',
  `otpNumber` int NOT NULL DEFAULT '0',
  `otpGeneratedAt` timestamp NULL DEFAULT NULL,
  `isVerified` tinyint(1) NOT NULL DEFAULT '0',
  `loginFailAttempt` int NOT NULL DEFAULT '0',
  `blocked` tinyint(1) NOT NULL DEFAULT '0',
  `emailVerifiedAt` timestamp NULL DEFAULT NULL,
  `password` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rememberToken` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imageInfo` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `empNotification` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT NULL,
  `modifiedAt` timestamp NULL DEFAULT NULL,
  `lastLoginActivity` timestamp NULL DEFAULT NULL,
  `lastAcknowledgedAlert` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '22-4-2023 11:12:49',
  `notificationId` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '0',
  `notificationTimestamp` timestamp NULL DEFAULT NULL,
  `deviceDetails` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emailNotification` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'INSTANT',
  `smsNotification` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'NONE',
  `recordedTimestamp` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `mobileNumber`, `employeeID`, `companyCode`, `locationID`, `branchID`, `facilityID`, `buildingID`, `floorID`, `zoneID`, `userRole`, `changePassword`, `secLevelAuth`, `otpNumber`, `otpGeneratedAt`, `isVerified`, `loginFailAttempt`, `blocked`, `emailVerifiedAt`, `password`, `rememberToken`, `imageInfo`, `empNotification`, `createdAt`, `modifiedAt`, `lastLoginActivity`, `lastAcknowledgedAlert`, `notificationId`, `notificationTimestamp`, `deviceDetails`, `emailNotification`, `smsNotification`, `recordedTimestamp`) VALUES
(283, 'System Specialist', 'aqmx@grandco.ca', '9901018556', '00000', 'KW', NULL, NULL, NULL, NULL, NULL, NULL, 'systemSpecialist', 0, 0, 1514, '2023-08-12 13:08:32', 1, 0, 0, NULL, '$2y$10$FOw4WSgsNzDFO1u5Zq9Al.q6rlwzhfOUsK93dTFN3x9rGVICJQMte', NULL, '{\"logo\":\"company/KW/logo.jpg\", \"loginPageImage\":\"company/KW/image.png\", \"companyName\": \"Kewaunee Labway India Pvt Ltd\"}', 1, '2023-08-12 13:06:39', '2023-12-19 06:17:38', '2023-12-19 06:17:37', '13-12-2023 11:19:51', '19341', NULL, NULL, 'INSTANT', 'INSTANT', NULL),
(311, 'System Specialist', 'jananes@grandco.ca', '9449026060', '00000', 'KW', NULL, NULL, NULL, NULL, NULL, NULL, 'systemSpecialist', 0, 0, 1514, '2023-08-12 13:08:32', 1, 0, 0, NULL, '$2y$10$FOw4WSgsNzDFO1u5Zq9Al.q6rlwzhfOUsK93dTFN3x9rGVICJQMte', NULL, '{\"logo\":\"company/KW/logo.jpg\", \"loginPageImage\":\"company/KW/image.png\", \"companyName\": \"Kewaunee Labway India Pvt Ltd\"}', 1, '2023-08-12 13:06:39', '2023-12-19 06:17:38', '2023-12-19 06:17:37', '13-12-2023 11:19:51', '', NULL, NULL, 'INSTANT', 'INSTANT', NULL),
(312, 'System Specialist', 'mageshwarig@grandco.ca', '9940013472', '00000', 'KW', NULL, NULL, NULL, NULL, NULL, NULL, 'systemSpecialist', 0, 0, 1514, '2023-08-12 13:08:32', 1, 0, 0, NULL, '$2y$10$FOw4WSgsNzDFO1u5Zq9Al.q6rlwzhfOUsK93dTFN3x9rGVICJQMte', NULL, '{\"logo\":\"company/KW/logo.jpg\", \"loginPageImage\":\"company/KW/image.png\", \"companyName\": \"Kewaunee Labway India Pvt Ltd\"}', 1, '2023-08-12 13:06:39', '2023-12-19 06:17:38', '2023-12-19 06:17:37', '13-12-2023 11:19:51', '', NULL, NULL, 'INSTANT', 'INSTANT', NULL),
(313, 'System Specialist', 'shajithahmed@grandco.ca', '9003259719', '00000', 'KW', NULL, NULL, NULL, NULL, NULL, NULL, 'systemSpecialist', 0, 0, 1514, '2023-08-12 13:08:32', 1, 0, 0, NULL, '$2y$10$FOw4WSgsNzDFO1u5Zq9Al.q6rlwzhfOUsK93dTFN3x9rGVICJQMte', NULL, '{\"logo\":\"company/KW/logo.jpg\", \"loginPageImage\":\"company/KW/image.png\", \"companyName\": \"Kewaunee Labway India Pvt Ltd\"}', 1, '2023-08-12 13:06:39', '2023-12-19 06:17:38', '2023-12-19 06:17:37', '13-12-2023 11:19:51', '', NULL, NULL, 'INSTANT', 'INSTANT', NULL),
(314, 'System Specialist', 'anandang@gmail.com', '9003259719', '2535', 'KW', NULL, NULL, NULL, NULL, NULL, NULL, 'systemSpecialist', 0, 0, 1514, '2023-08-12 13:08:32', 1, 0, 0, NULL, '$2y$10$FOw4WSgsNzDFO1u5Zq9Al.q6rlwzhfOUsK93dTFN3x9rGVICJQMte', NULL, '{\"logo\":\"company/KW/logo.jpg\", \"loginPageImage\":\"company/KW/image.png\", \"companyName\": \"Kewaunee Labway India Pvt Ltd\"}', 1, '2023-08-12 13:06:39', '2023-12-19 06:17:38', '2023-12-19 06:17:37', '13-12-2023 11:19:51', '', NULL, NULL, 'INSTANT', 'INSTANT', NULL),
(315, 'System Specialist', 'madhankumar05072000@gmail.com', '9445825981', '00000', 'KW', NULL, NULL, NULL, NULL, NULL, NULL, 'systemSpecialist', 0, 0, 1514, '2023-08-12 13:08:32', 1, 0, 0, NULL, '$2y$10$FOw4WSgsNzDFO1u5Zq9Al.q6rlwzhfOUsK93dTFN3x9rGVICJQMte', NULL, '{\"logo\":\"company/KW/logo.jpg\", \"loginPageImage\":\"company/KW/image.png\", \"companyName\": \"Kewaunee Labway India Pvt Ltd\"}', 1, '2023-08-12 13:06:39', '2023-12-19 06:17:38', '2023-12-19 06:17:37', '13-12-2023 11:19:51', '', NULL, NULL, 'INSTANT', 'INSTANT', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `zones`
--

CREATE TABLE `zones` (
  `id` int NOT NULL,
  `locationID` int DEFAULT NULL,
  `branchID` int DEFAULT NULL,
  `facilityID` int DEFAULT NULL,
  `buildingID` int DEFAULT NULL,
  `floorID` int DEFAULT NULL,
  `zoneName` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `coordinates` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `image` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentID` int DEFAULT NULL,
  `isAQI` tinyint(1) DEFAULT NULL,
  `zoneHooterStatus` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `aqiValue` decimal(11,3) DEFAULT NULL,
  `emailInstant` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `smsInstant` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applicationVersions`
--
ALTER TABLE `applicationVersions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `aqi`
--
ALTER TABLE `aqi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `buildings`
--
ALTER TABLE `buildings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `communication`
--
ALTER TABLE `communication`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `devices`
--
ALTER TABLE `devices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `emailTextInfo`
--
ALTER TABLE `emailTextInfo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `facilities`
--
ALTER TABLE `facilities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `floors`
--
ALTER TABLE `floors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sensorOutputTypes`
--
ALTER TABLE `sensorOutputTypes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sensors`
--
ALTER TABLE `sensors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sensorsType`
--
ALTER TABLE `sensorsType`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `zones`
--
ALTER TABLE `zones`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applicationVersions`
--
ALTER TABLE `applicationVersions`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `aqi`
--
ALTER TABLE `aqi`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `buildings`
--
ALTER TABLE `buildings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `communication`
--
ALTER TABLE `communication`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `devices`
--
ALTER TABLE `devices`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `emailTextInfo`
--
ALTER TABLE `emailTextInfo`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `facilities`
--
ALTER TABLE `facilities`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `floors`
--
ALTER TABLE `floors`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sensorOutputTypes`
--
ALTER TABLE `sensorOutputTypes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `sensors`
--
ALTER TABLE `sensors`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sensorsType`
--
ALTER TABLE `sensorsType`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=319;

--
-- AUTO_INCREMENT for table `zones`
--
ALTER TABLE `zones`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
