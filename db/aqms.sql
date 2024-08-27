-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 20, 2024 at 11:27 AM
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
-- Database: `aqms`
--
CREATE DATABASE IF NOT EXISTS `aqms` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `aqms`;

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
(1, 'Ai-Dea Labs Pvt Ltd', 'AI', 'aqms@aidealabs.com', 'https://aidealabs.com', '{\"logo\":\"company/AI/aidealabsLogo.png\", \"loginPageImage\":\"company/AI/aideaLabsImage.jpg\", \"companyName\": \"A-idea Labs India Pvt Ltd\"}', NULL, NULL, '2023-12-14 03:47:49', '2023-12-28 09:21:56'),
(2, 'Kewaunee Labway India Pvt Ltd', 'KW', 'aqmx@aidealabs.com', 'https://www.kewaunee.in/', '{\"logo\":\"company/KW/logo.jpg\", \"loginPageImage\":\"company/KW/image.png\", \"companyName\": \"Kewaunee Labway India Pvt Ltd\"}', NULL, NULL, '2023-12-14 03:48:36', '2023-12-28 09:21:56');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applicationVersions`
--
ALTER TABLE `applicationVersions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `company`
--
ALTER TABLE `company`
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
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
