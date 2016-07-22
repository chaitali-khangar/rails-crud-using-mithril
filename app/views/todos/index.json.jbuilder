json.array!(@todos) do |todo|
  json.extract! todo, :id, :description, :done
  json.url todo_url(todo, format: :json)
end
