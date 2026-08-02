package utils

import (
	"fmt"
	"net/smtp"
	"os"
)

type EmailConfig struct {
	Host     string
	Port     string
	Username string
	Password string
	From     string
}

func GetEmailConfig() EmailConfig {
	return EmailConfig{
		Host:     getEnv("SMTP_HOST", "smtp.gmail.com"),
		Port:     getEnv("SMTP_PORT", "587"),
		Username: getEnv("SMTP_USERNAME", "grecyedl@gmail.com"),
		Password: getEnv("SMTP_PASSWORD", "cbwn shcu gegw hdgq"),
		From:     getEnv("SMTP_FROM", "grecyedl@gmail.com"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func SendResetEmail(to, resetLink string) error {
	config := GetEmailConfig()

	if config.Username == "" || config.Password == "" {
		return fmt.Errorf("SMTP tidak dikonfigurasi")
	}

	subject := "Reset Password - Nazar Paint Admin"
	body := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="UTF-8">
			<title>Reset Password</title>
			<style>
				body { font-family: Arial, sans-serif; background: #f8fafc; padding: 20px; }
				.container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; }
				.logo { font-size: 28px; font-weight: 700; color: #EA580C; text-align: center; }
				.title { font-size: 22px; font-weight: 600; color: #1E293B; margin: 20px 0 10px; text-align: center; }
				.text { color: #475569; line-height: 1.6; margin-bottom: 16px; }
				.button { background: #EA580C; color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; display: inline-block; }
				.button-container { text-align: center; margin: 30px 0; }
				.warning { color: #DC2626; font-weight: 600; margin: 16px 0; }
				.footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 12px; color: #94A3B8; }
			</style>
		</head>
		<body>
			<div class="container">
				<div class="logo">🎨 Nazar Paint</div>
				<h1 class="title">🔐 Reset Password</h1>
				<p class="text">Halo Admin,</p>
				<p class="text">Kami menerima permintaan untuk mereset password akun admin Anda di <strong>Nazar Paint</strong>.</p>
				<p class="text">Klik tombol di bawah untuk membuat password baru:</p>
				<div class="button-container">
					<a href="%s" class="button">Reset Password</a>
				</div>
				<p class="warning">⚠️ Link ini hanya berlaku selama 1 jam.</p>
				<p class="text" style="font-size: 14px;">Jika Anda tidak meminta reset password, abaikan email ini.</p>
				<div class="footer">
					<p>© 2026 Nazar Paint - Toko Cat Terpercaya</p>
				</div>
			</div>
		</body>
		</html>
	`, resetLink)

	msg := []byte(fmt.Sprintf(
		"To: %s\r\n"+
			"Subject: %s\r\n"+
			"Content-Type: text/html; charset=UTF-8\r\n"+
			"\r\n"+
			"%s",
		to, subject, body,
	))

	auth := smtp.PlainAuth("", config.Username, config.Password, config.Host)
	err := smtp.SendMail(config.Host+":"+config.Port, auth, config.From, []string{to}, msg)
	if err != nil {
		return fmt.Errorf("gagal kirim email: %v", err)
	}
	return nil
}