name := "SistemaGestion"

version := "0.1"

scalaVersion := "2.13.12"

Compile / run / mainClass := Some("app.Main")

libraryDependencies ++= Seq(
  "com.lihaoyi" %% "upickle" % "3.1.3",
  "com.lihaoyi" %% "cask" % "0.9.1"
)