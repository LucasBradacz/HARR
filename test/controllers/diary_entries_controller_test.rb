require "test_helper"

class DiaryEntriesControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get diary_entries_create_url
    assert_response :success
  end

  test "should get edit" do
    get diary_entries_edit_url
    assert_response :success
  end

  test "should get update" do
    get diary_entries_update_url
    assert_response :success
  end

  test "should get destroy" do
    get diary_entries_destroy_url
    assert_response :success
  end
end
