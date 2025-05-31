-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 31, 2025 at 03:06 AM
-- Server version: 8.0.38
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `online_camera`
--

-- --------------------------------------------------------

--
-- Table structure for table `brand`
--

CREATE TABLE `brand` (
  `brand_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `logo_url` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `brand`
--

INSERT INTO `brand` (`brand_id`, `name`, `logo_url`, `description`, `created_at`) VALUES
(1, 'Sony', 'anh.png', 'Thương hiệu của Sony', '2025-04-02 23:36:34'),
(2, 'Canon', 'Canon.png', 'Siêu chất', '2025-04-02 23:38:43'),
(3, 'Sony Promax', 'anh.png', 'Thương hiệu của Sony', '2025-04-03 01:04:13'),
(4, 'Nikon', '', 'đẹp', '2025-04-04 11:59:54'),
(5, 'Panasonic', '', 'siêu', '2025-04-04 12:00:27');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `cart_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`cart_id`, `user_id`, `created_at`) VALUES
(13, 5, '2025-04-04 16:03:14');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `cart_item_id` int NOT NULL,
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `category_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`category_id`, `name`, `description`, `created_at`) VALUES
(1, 'Máy Ảnh', 'Siuuuuuuuuuuuuuu', '2025-04-02 23:34:17'),
(2, 'Ống kính', 'Messiiiiiiiiiii', '2025-04-02 23:35:05'),
(3, 'Chân máy ', 'gọn', '2025-04-04 11:57:24'),
(4, 'Thẻ nhớ', 'rộng', '2025-04-04 11:57:50'),
(5, 'Pin và sạc dự phòng', 'Nhiều', '2025-04-04 11:58:21');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int NOT NULL,
  `user_id` int NOT NULL,
  `total_price` decimal(15,2) NOT NULL,
  `status` varchar(50) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `total_price`, `status`, `payment_method`, `created_at`) VALUES
(1, 12, 10000000.00, 'processing', 'credit_card', '2025-04-03 15:58:16'),
(2, 12, 10000000.00, 'processing', 'credit_card', '2025-04-03 16:19:38'),
(3, 12, 10000000.00, 'processing', 'credit_card', '2025-04-03 16:41:01'),
(4, 12, 10000000.00, 'processing', 'credit_card', '2025-04-03 17:21:51'),
(5, 14, 20000000.00, 'processing', 'credit_card', '2025-04-03 19:54:59'),
(6, 6, 10000000.00, 'processing', 'cash_on_delivery', '2025-04-03 22:51:38'),
(7, 6, 77000000.00, 'completed', 'cash_on_delivery', '2025-04-04 11:02:39'),
(8, 6, 2000000.00, 'processing', 'cash_on_delivery', '2025-04-04 15:28:09'),
(9, 6, 20000.00, 'processing', 'credit_card', '2025-04-04 15:32:03'),
(10, 6, 14000.00, 'processing', 'cash_on_delivery', '2025-04-04 15:33:52'),
(11, 5, 10020000.00, 'processing', 'credit_card', '2025-04-04 16:02:53'),
(12, 6, 2000000.00, 'processing', 'credit_card', '2025-04-04 16:06:34'),
(13, 14, 15000000.00, 'processing', 'cash_on_delivery', '2025-04-04 16:15:06'),
(14, 14, 70020000.00, 'completed', 'credit_card', '2025-04-04 16:21:30'),
(15, 14, 160020000.00, 'processing', 'cash_on_delivery', '2025-04-04 16:31:28');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_items_id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `total` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`order_items_id`, `order_id`, `product_id`, `quantity`, `price`, `total`) VALUES
(1, 1, 9, 1, 10000000.00, 10000000.00),
(2, 2, 9, 1, 10000000.00, 10000000.00),
(3, 3, 9, 1, 10000000.00, 10000000.00),
(4, 4, 9, 1, 10000000.00, 10000000.00),
(5, 5, 7, 1, 10000000.00, 10000000.00),
(6, 5, 9, 1, 10000000.00, 10000000.00),
(7, 6, 8, 1, 10000000.00, 10000000.00),
(8, 7, 9, 1, 10000000.00, 10000000.00),
(9, 7, 12, 1, 67000000.00, 67000000.00),
(10, 8, 17, 1, 2000000.00, 2000000.00),
(11, 9, 18, 1, 20000.00, 20000.00),
(12, 10, 20, 1, 14000.00, 14000.00),
(13, 11, 7, 1, 10000000.00, 10000000.00),
(14, 11, 18, 1, 20000.00, 20000.00),
(15, 12, 17, 1, 2000000.00, 2000000.00),
(16, 13, 9, 1, 10000000.00, 10000000.00),
(17, 13, 16, 1, 2000000.00, 2000000.00),
(18, 13, 15, 1, 3000000.00, 3000000.00),
(19, 14, 7, 7, 10000000.00, 70000000.00),
(20, 14, 19, 2, 10000.00, 20000.00),
(21, 15, 18, 1, 20000.00, 20000.00),
(22, 15, 15, 2, 3000000.00, 6000000.00),
(23, 15, 11, 2, 20000000.00, 40000000.00),
(24, 15, 3, 2, 57000000.00, 114000000.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `category_id` int NOT NULL,
  `brand_id` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `name`, `description`, `price`, `quantity`, `image_url`, `category_id`, `brand_id`, `created_at`) VALUES
(1, 'Canon EOS 5D Mark IV', 'Máy ảnh DSLR chuyên nghiệp', 25000000.00, 6, '1741597472986-142244202.jpg', 1, 1, '2025-01-16 15:16:27'),
(2, 'Sony Alpha a7 III', 'Máy ảnh không gương lật hiện đại', 30000000.00, 6, '1741766926266-965832911.jpg', 2, 1, '2025-01-16 15:16:27'),
(3, 'Sony Alpha a9', 'Máy ảnh gương lật hiện đại', 57000000.00, 4, '1741766992058-540147789.jpg', 1, 1, '2025-01-16 15:16:27'),
(4, 'Sony Alpha a9 nhập khẩu', 'Máy ảnh tương lai nhân loại', 62000000.00, 3, '1741767046876-574753157.jpg', 1, 1, '2025-03-05 23:04:01'),
(5, 'Máy ảnh', 'Siêu vip pro', 10.00, 1, '1741596984355-564477988.jpg', 2, 1, '2025-03-10 15:56:24'),
(7, 'Ống Kính Nhìn Xuyên Thấu', 'Ống kính được thiết kế theo thiết kế', 10000000.00, 2, '1742540505585-441956989.jpg', 1, 1, '2025-03-21 14:01:45'),
(8, 'Ống Kính Nhìn Mặt Trăng', 'Ống kính được thiết kế theo thiết kế', 10000000.00, 11, '1742540854775-154993064.png', 1, 1, '2025-03-21 14:07:34'),
(9, 'Ống Kính NiKon', 'Ống kính được thiết kế theo thiết kế', 10000000.00, 4, '1743670485895-657308819.jpg', 2, 3, '2025-04-03 15:54:45'),
(10, 'Ống kính siêu dễ hư', 'đững mua', 20000000.00, 5, '1743711028197-288724139.jpg', 2, 2, '2025-04-04 03:10:28'),
(11, 'Ống kính siêu dễ hư', 'đững mua', 20000000.00, 3, '1743711035448-173338817.jpg', 2, 2, '2025-04-04 03:10:35'),
(12, 'Mắt Kính', 'Bạn thấy tôi đẹp troai không', 67000000.00, 6, '1743711696753-939946264.jpg', 2, 2, '2025-04-04 03:21:36'),
(14, 'Dự mập', 'quá mập', 1.00, 1, '1743711904058-128387730.jpg', 1, 1, '2025-04-04 03:25:04'),
(15, 'Chân Máy NO1', 'Chất liệu dễ gãy', 3000000.00, 2, '1743743142546-10262541.jpg', 3, 4, '2025-04-04 12:05:42'),
(16, 'Thẻ nhớ 32GB', 'Mạnh', 2000000.00, 1, '1743744105887-276846409.jpg', 4, 5, '2025-04-04 12:21:45'),
(17, 'Thẻ nhớ 32GB', 'Mạnh', 2000000.00, 0, '1743744226081-316406560.jpg', 4, 5, '2025-04-04 12:23:46'),
(18, 'Pin dự phòng N1', 'mạnh', 20000.00, 0, '1743744400080-963009731.jpg', 5, 3, '2025-04-04 12:26:40'),
(19, 'Pin Năng Lượng', 'siêu mạnh', 10000.00, 0, '1743745026891-53082589.png', 2, 4, '2025-04-04 12:37:06'),
(20, 'Phụ kiện vip', '12321', 14000.00, 122, '1743745502234-539422265.jpg', 3, 2, '2025-04-04 12:45:02');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `address` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `password`, `name`, `phone`, `address`, `role`, `created_at`) VALUES
(3, 'hoaidu@example.com', '123', 'Hoài Dự', '0123456789', '123 Main St', 'user', '2025-01-16 16:11:06'),
(5, 'admin@example.com', '$2a$12$qhIptAARGkIedmyEJVqxk.imlY9OG5iFJuf7cGU9GUsMivcH1YxIe', 'admin123', '0000000000', 'Admin Street', 'admin', '2025-01-16 16:11:06'),
(6, 'nguyenvana@example.com', '$2b$10$VB7aT/g8riN1b6ksPnszqO5e7NYBtyOjwHh44hV1CnqvFIbYQuzR.', 'Nguyen Van A', '0123456789', 'Hà Nội, Việt Nam', 'user', '2025-02-28 16:14:23'),
(7, 'nguyenvanabcd@example.com', '$2b$10$cka154sg9Oc7S4pbenycieD/s19gp9UstTniulksSgJNGRraqmkNi', 'Nguyễn Văn Abcccd', '0123456789', 'Hà Nội, Việt Nam', 'user', '2025-03-03 14:57:36'),
(10, 'banguyen@gmail.com', '$2b$10$WODkn56qZZhjYfard0RRb.xtltplGQjnSuwYOEzDMpBqq71TEhzhi', 'Sáu năm bốn ba hai một', '0346837567', '406 Nguyễn Hữu Dực,Đông hòa, Phú Yên', 'user', '2025-03-17 22:09:25'),
(12, 'ba@gmail.com', '$2b$10$uxmA4g2KGixI2MQaiECCMeffxyoxl7NPs.Y7UFchC3C5szBGiWmRC', 'một hai ba', '0356486632', '406 Nguyễn Hữu Dực,Gò Vấp, HCM', 'user', '2025-03-21 14:06:18'),
(14, 'tranro@gmail.com', '$2b$10$R9AZBbAi11HdviVahMnQTOu5NBTzno/LPIimGxaokWnkiFjzNKVEq', 'Trần In Rô', '0345520558', '23/4an nhơn', 'user', '2025-04-03 19:46:33'),
(15, 'du@gmail.com', '$2b$10$knyniPwuPQQDo/RFdWnS7e.BhJanXlpiX/AU03H5IowEfbggVcLWC', 'du', '342343432423', '434/hcm', 'user', '2025-04-04 13:57:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `brand`
--
ALTER TABLE `brand`
  ADD PRIMARY KEY (`brand_id`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`cart_item_id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_items_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `brand_id` (`brand_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `brand`
--
ALTER TABLE `brand`
  MODIFY `brand_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `cart_item_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `category_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_items_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`brand_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
