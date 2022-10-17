package main

import "testing"

func TestCheckGithubSlug(t *testing.T) {
	s := get_github_slug("Source: https://github.com/euske/ld39/")

	if s == "invalid url" {
		t.Fatal("failed")
	}
}
