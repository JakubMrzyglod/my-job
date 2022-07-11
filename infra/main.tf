terraform {
  required_version = ">= 0.14"

  required_providers {
    google = ">= 3.3"
  }
}

provider "google" {
  project = "myjob-355709"
}

resource "google_project_service" "run_api" {
  service = "run.googleapis.com"

  disable_on_destroy = true
}

resource "google_cloud_run_service" "run_service" {
  name = "api"
  location = "europe-central2"

  template {
    spec {
      containers {
        image = "gcr.io/google-samples/hello-app:1.0"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [google_project_service.run_api]
}

resource "google_cloud_run_service_iam_member" "run_all_users" {
  service  = google_cloud_run_service.run_service.name
  location = google_cloud_run_service.run_service.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

output "service_url" {
  value = google_cloud_run_service.run_service.status[0].url
}

resource "google_sql_database_instance" "instance" {
  name = "db-instance"
  database_version = "MYSQL_8_0"
  region = "europe-central2"
  settings {
    tier = "db-f1-micro"
  }
}
resource "google_sql_database" "database" {
  name = "db"
  instance = "${google_sql_database_instance.instance.name}"
  charset = "utf8"
  collation = "utf8_general_ci"
}
resource "google_sql_user" "users" {
  name = "user"
  instance = "${google_sql_database_instance.instance.name}"
  host = "%"
  password = "pass"
}
