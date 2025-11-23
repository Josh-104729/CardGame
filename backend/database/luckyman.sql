/*
 LuckyMan Card Game Database Schema
 Based on frontend and backend code analysis
 
 Source Server Type    : MySQL
 Target Server Version : 5.7+
 File Encoding         : utf8mb4
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for person_info
-- User account information
-- ----------------------------
DROP TABLE IF EXISTS `person_info`;
CREATE TABLE `person_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bounty` int(11) NULL DEFAULT 10000,
  `signtoken` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '------',
  `birthdate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `gender` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `allowedbyadmin` int(11) NULL DEFAULT 0,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `avatar_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `create_at` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `username` (`username`) USING BTREE,
  KEY `idx_signtoken` (`signtoken`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for room_info
-- Active game rooms information
-- ----------------------------
DROP TABLE IF EXISTS `room_info`;
CREATE TABLE `room_info` (
  `room_id` int(11) NOT NULL AUTO_INCREMENT,
  `creator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bonus` int(11) NULL DEFAULT NULL,
  `fee` int(11) NULL DEFAULT NULL,
  `size` int(11) NULL DEFAULT NULL,
  `members` int(11) NULL DEFAULT 0,
  `status` int(11) NULL DEFAULT 0 COMMENT '0=Waiting, 1=Full, 2=Playing, 3=Closed',
  `created_at` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `updated_at` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`room_id`) USING BTREE,
  KEY `idx_creator` (`creator`) USING BTREE,
  KEY `idx_status` (`status`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for game_logs
-- Individual game round logs (player results per game)
-- ----------------------------
DROP TABLE IF EXISTS `game_logs`;
CREATE TABLE `game_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `room_id` int(11) NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bonus` int(11) NULL DEFAULT NULL,
  `create_at` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_room_id` (`room_id`) USING BTREE,
  KEY `idx_username` (`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for room_log_info
-- Historical room creation logs
-- ----------------------------
DROP TABLE IF EXISTS `room_log_info`;
CREATE TABLE `room_log_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `creator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bonus` int(11) NULL DEFAULT NULL,
  `fee` int(11) NULL DEFAULT NULL,
  `size` int(11) NULL DEFAULT NULL,
  `status` int(11) NULL DEFAULT NULL,
  `members` int(11) NULL DEFAULT NULL,
  `created_at` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `updated_at` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_creator` (`creator`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;
